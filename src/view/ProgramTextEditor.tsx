import React, {useEffect, useState} from "react";
import {ProgramText} from "../model/ProgramText";
import * as Model from "../model/ProgramText";
import "./ProgramTextEditor.css";

interface ProgramTextEditorProps {
    programText: Model.ProgramText;

    setProgramText(rawLines: string[]): void;
}

type Cursor = readonly [number, number];

export function ProgramTextEditor({programText, setProgramText}: ProgramTextEditorProps) {

    const [cursor, setCursor] = useState([2, 0] as Cursor);

    // Set up global key listener
    useEffect(() => {
        const listener = (evt: KeyboardEvent) => handleKeyDown(evt, cursor, setCursor, programText, setProgramText);
        document.addEventListener("keydown", listener);

        return () => {
            document.removeEventListener("keydown", listener);
        };
    });

    return <div className="ProgramTextEditor">
        {programText.rawLines.map((ln, num) =>
            <ProgramTextLine key={num} raw={ln} num={num} cursor={cursor}/>,
        )}
    </div>;
}

interface ProgramTextLineProps {
    raw: string;
    num: number;
    codeLine?: Model.ProgramTextLine;
    cursor: readonly [number, number];
}

function ProgramTextLine({raw, num, codeLine, cursor}: ProgramTextLineProps) {

    // Replace spaces with non-breaking spaces (U+00A0)
    raw = raw.replaceAll(" ", "\u00A0");

    let content: React.ReactElement;

    if (cursor[0] === num) {
        // Cursor is on our line
        const beforeCursor = raw.substring(0, cursor[1]);
        const afterCursor = raw.substring(cursor[1]);
        content = <><span>{beforeCursor}</span><span
            className="ProgramTextEditor__Line__RightOfCursor">{afterCursor}</span></>;
    } else {
        content = <span>{raw || "\u200B"}</span>;
    }

    return <div className="ProgramTextEditor__Line">
        {content}
    </div>;
}

function handleKeyDown(
    evt: KeyboardEvent,
    cursor: Cursor,
    setCursor: (_: Cursor) => void,
    programText: ProgramText,
    setProgramText: (rawLines: string[]) => void,
) {
    // We don't handle any keyboard commands (yet)
    if (evt.altKey || evt.ctrlKey || evt.metaKey) {
        return;
    }

    const [row, col] = cursor;

    // Collect some values that we'll likely use further down
    const untouchedLinesBefore = programText.rawLines.slice(0, row);
    const untouchedLinesAfter = programText.rawLines.slice(row + 1);
    const touchedLine = programText.rawLines[row];

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

    default:
        // Handle simple directly-typable characters
        if (evt.key.length === 1 && (evt.key >= "a" && evt.key <= "z" || evt.key >= "A" && evt.key <= "Z" || evt.key >= "0" && evt.key <= "9" || evt.key === " ")) {
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
        return [row - 1, col];

    case "ArrowDown":
        if (row === rawLines.length - 1) {
            return [row, rawLines[row].length];
        }
        return [row + 1, col];
    }
}
