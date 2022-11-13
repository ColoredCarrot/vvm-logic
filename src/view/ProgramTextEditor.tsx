import React, {useContext, useState} from "react";
import {ExecutionError} from "../exec/ExecutionError";
import {InvalidInstruction} from "../exec/instructions/InvalidInstruction";
import {CodeLine, LabelLine} from "../model/ProgramText";
import * as ProgramText from "../model/ProgramText";
import {State} from "../model/State";
import {AppStateContext} from "./AppState";
import "./ProgramTextEditor.scss";
import {useGlobalEvent} from "./util/UseGlobalEvent";

interface ProgramTextEditorProps {

    vmState: State;

    programText: ProgramText.Text;

    setProgramText(rawLines: string[]): void;
}

type Cursor = readonly [number, number];

export function ProgramTextEditor({vmState, programText, setProgramText}: ProgramTextEditorProps) {

    const [cursor, setCursor] = useState([2, 0] as Cursor);

    // Set up global listeners
    useGlobalEvent("keydown", evt => handleKeyDown(evt, cursor, setCursor, programText, setProgramText));
    useGlobalEvent("paste", evt => handlePaste(evt));

    function handlePaste(evt: ClipboardEvent): void {
        const toPaste = evt.clipboardData?.getData("text/plain");
        if (!toPaste) {
            return;
        }

        // TODO: Don't replace, but insert
        setProgramText(toPaste.split("\n").map(ln => ln.replaceAll(/[^0-9a-z/: ]/ig, "")));
        setCursor([0, 0]);
    }

    return <div className="ProgramTextEditor">
        {programText.lines.map(line =>
            <ProgramTextLine
                key={line.num}
                line={line}
                cursor={cursor}
                vmState={vmState}
            />,
        )}
    </div>;
}

interface ProgramTextLineProps {
    line: ProgramText.Line;
    cursor: Cursor;
    vmState: State;
}

function ProgramTextLine({line, cursor, vmState}: ProgramTextLineProps) {
    const NON_BREAKING_SPACE = "\u00A0";
    const ZERO_WIDTH_SPACE = "\u200B";

    const raw = line.raw.replaceAll(" ", NON_BREAKING_SPACE) || ZERO_WIDTH_SPACE;
    const isActiveLine = line instanceof CodeLine && line.codeLineNum === vmState.programCounter + 1;

    const [appState, setAppState] = useContext(AppStateContext);

    let content: React.ReactElement;

    let cssClass = "ProgramTextEditor__Line";
    if (isActiveLine) {
        if (appState.lastExecutionError !== null) {
            // We were the last instruction to attempt to be executed, but it failed!
            cssClass += " ProgramTextEditor__Line--critical";
        } else {
            cssClass += " ProgramTextEditor__Line--active";
        }
    } else if (line instanceof CodeLine && line.instruction instanceof InvalidInstruction) {
        cssClass += " ProgramTextEditor__Line--error";
    } else if (line instanceof LabelLine) {
        cssClass += " ProgramTextEditor__Line--label";
    }

    let innerCssClass = "ProgramTextEditor__Line__Inner";
    if (cursor[0] === line.num) {
        innerCssClass += " ProgramTextEditor__Line__Inner--cursor";
    }

    if (cursor[0] === line.num) {
        // Caret is on our line
        content = <span>
            <span style={{zIndex: 10, position: "absolute"}}>
                <span>{NON_BREAKING_SPACE.repeat(cursor[1])}</span>
                <span className="ProgramTextEditor__Caret"></span>
            </span>
            <span>{raw}</span>
        </span>;
    } else {
        content = <span>{raw}</span>;
    }

    const textLineElem = <div className={cssClass}>
        <div className={innerCssClass}>
            <span
                className="ProgramTextEditor__Line__Num">{(line.num + 1).toString().padStart(3, NON_BREAKING_SPACE)}</span>
            {content}
        </div>
    </div>;

    let resultElem = textLineElem;
    if (isActiveLine && appState.lastExecutionError !== null) {
        resultElem = <>
            {textLineElem}
            <div className="ProgramTextEditor__Popout">
                <div className="ProgramTextEditor__Popout__Heading">Whoops!</div>
                The instruction failed to execute:
                <span className="ProgramTextEditor__Popout__InternalMessage">
                    {appState.lastExecutionError instanceof ExecutionError ? appState.lastExecutionError.message : appState.lastExecutionError}
                </span>
            </div>
        </>;
    }

    return resultElem;
}

function handleKeyDown(
    evt: KeyboardEvent,
    cursor: Cursor,
    setCursor: (_: Cursor) => void,
    programText: ProgramText.Text,
    setProgramText: (rawLines: string[]) => void,
) {
    // We don't handle any keyboard commands (yet)
    if (evt.altKey || evt.ctrlKey || evt.metaKey) {
        return;
    }

    const [row, col] = cursor;

    // Collect some values that we'll likely use further down
    const untouchedLinesBefore = programText.lines.slice(0, row).map(l => l.raw);
    const untouchedLinesAfter = programText.lines.slice(row + 1).map(l => l.raw);
    const touchedLine = programText.lines[row].raw;

    switch (evt.key) {
    case "ArrowLeft":
    case "ArrowRight":
    case "ArrowUp":
    case "ArrowDown": {
        setCursor(moveCursor(cursor, evt.key, programText.rawLines));
        break;
    }

    case "Enter": {
        // No special cases; always split current line into two
        const updatedLines = [
            ...untouchedLinesBefore,
            touchedLine.slice(0, col),
            touchedLine.slice(col),
            ...untouchedLinesAfter,
        ];
        setProgramText(updatedLines);
        setCursor([row + 1, 0]);

        break;
    }

    case "Backspace": {
        // Special case: At the very beginning of the text, do nothing
        if (row === 0 && col === 0) {
            break;
        }

        // Special case: At the beginning of a line, merge that line into the previous one
        if (col === 0) {
            const updatedLines = [
                ...programText.rawLines.slice(0, row - 1),
                programText.rawLines[row - 1] + programText.rawLines[row],
                ...programText.rawLines.slice(row + 1),
            ];

            setProgramText(updatedLines);
            setCursor([row - 1, programText.rawLines[row - 1].length]);

            break;
        }

        const updatedLine = touchedLine.slice(0, col - 1) + touchedLine.slice(col);
        const updatedLines = untouchedLinesBefore.concat(updatedLine, untouchedLinesAfter);

        setProgramText(updatedLines);
        setCursor(moveCursor(cursor, "ArrowLeft", updatedLines));

        break;
    }

    case "Delete": {
        // Special case: At the very end of the text, do nothing
        if (row === programText.rawLines.length - 1 && col === programText.rawLines[row].length) {
            break;
        }

        // Special case: At the end of a line, merge the next line into the current one
        if (col === programText.rawLines[row].length) {
            const updatedLines = [
                ...programText.rawLines.slice(0, row),
                programText.rawLines[row] + programText.rawLines[row + 1],
                ...programText.rawLines.slice(row + 2),
            ];

            setProgramText(updatedLines);
            // cursor isn't moved

            break;
        }

        const updatedLine = touchedLine.slice(0, col) + touchedLine.slice(col + 1);
        const updatedLines = untouchedLinesBefore.concat(updatedLine, untouchedLinesAfter);
        setProgramText(updatedLines);
        // cursor isn't moved

        break;
    }

    default:
        // Handle simple directly-typable characters
        if (evt.key.length === 1 && (
            evt.key >= "a" && evt.key <= "z" ||
            evt.key >= "A" && evt.key <= "Z" ||
            evt.key >= "0" && evt.key <= "9" ||
            [" ", ":", "/"].includes(evt.key)
        )) {
            const char = evt.key;

            // TODO: Maybe, if we're in the first word of the line, automatically write in uppercase

            const touchedLineBefore = touchedLine.slice(0, col);
            const touchedLineAfter = touchedLine.slice(col);
            const updatedLine = touchedLineBefore + char + touchedLineAfter;

            const updatedLines = untouchedLinesBefore.concat(updatedLine, untouchedLinesAfter);

            setProgramText(updatedLines);
            setCursor(moveCursor(cursor, "ArrowRight", updatedLines));

            break;
        }

        // Can't handle the event
        return;
    }

    // At this point, it's certain that we've handled the event ourselves
    evt.preventDefault();
    evt.stopPropagation();
}

function moveCursor([row, col]: Cursor, direction: "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown", rawLines: readonly string[]): Cursor {
    switch (direction) {
    case "ArrowLeft":
        if (col === 0) {
            if (row === 0) {
                return [row, col];
            }
            return [row - 1, rawLines[row - 1].length];
        }
        return [row, col - 1];

    case "ArrowRight":
        if (col === rawLines[row].length) {
            if (row === rawLines.length - 1) {
                return [row, col];
            }
            return [row + 1, 0];
        }
        return [row, col + 1];

    case "ArrowUp":
        if (row === 0) {
            return [0, 0];
        }
        return [row - 1, Math.min(col, rawLines[row - 1].length)];

    case "ArrowDown":
        if (row === rawLines.length - 1) {
            return [row, rawLines[row].length];
        }
        return [row + 1, Math.min(col, rawLines[row + 1].length)];
    }
}
