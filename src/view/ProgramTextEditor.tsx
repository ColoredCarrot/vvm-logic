import React, {useContext, useEffect, useState} from "react";
import {ExecutionError} from "../exec/ExecutionError";
import {InvalidInstruction} from "../exec/instructions/InvalidInstruction";
import * as ProgramText from "../model/ProgramText";
import {CodeLine, CompositionLine, LabelLine} from "../model/ProgramText";
import {State} from "../model/State";
import {Caret, MovementMode, TextEditor} from "../model/text/TextEditor";
import {AppStateContext, ProgramTextContext, ProgramTextFacade} from "./AppState";
import "./ProgramTextEditor.scss";
import {useGlobalEvent} from "./util/UseGlobalEvent";

interface ProgramTextEditorProps {
    vmState: State;
}

export function ProgramTextEditor({vmState}: ProgramTextEditorProps) {

    const [isDraggingInto, setIsDraggingInto] = useState(false);

    const programTextFacade = useContext(ProgramTextContext);
    const {programText, editor, setEditor} = programTextFacade;

    // Set up global listeners
    useGlobalEvent("keydown", evt => handleKeyDown(evt, programTextFacade));
    useGlobalEvent("paste", evt => handlePaste(evt));

    function handlePaste(evt: ClipboardEvent): void {
        const toPaste = evt.clipboardData?.getData("text/plain");
        if (!toPaste) {
            return;
        }

        setEditor(editor.insert(toPaste));
    }

    function handleDrop(evt: React.DragEvent): void {
        const file = evt.dataTransfer.files.item(0);
        if (!file) {
            return;
        }

        evt.preventDefault();
        evt.stopPropagation();

        file.text().then(
            text => {
                setEditor(TextEditor.forText(text));
                setIsDraggingInto(false);
            },
            err => {
                console.error("Could not drag-and-drop file", err);
                setIsDraggingInto(false);
            },
        );
    }

    const activeLine = programText.getNextCodeLine(vmState.programCounter);

    // Scroll active line into view, but only when it changes (not on every rerender)
    useEffect(
        () => {
            if (activeLine !== null) {
                document.getElementById("program-text-line-" + activeLine.num)
                    ?.scrollIntoView({behavior: "smooth", block: "nearest"});
            }
        },
        [activeLine]
    );

    return <div
        className={"ProgramTextEditor" + (isDraggingInto ? " ProgramTextEditor--dragging-into" : "")}
        onDrop={evt => handleDrop(evt)}
        onDragOver={evt => evt.preventDefault()}
        onDragEnter={_ => setIsDraggingInto(true)}
        onDragLeave={_ => setIsDraggingInto(false)}
    >
        {programText.lines.map(line =>
            <ProgramTextLine
                key={line.num}
                text={programText}
                line={line}
                caretsOnLine={editor.carets.filter(({row}) => row === line.num)}
                setCaret={(caret, add) => setEditor(add ? editor.addCaret(caret) : editor.setCaret(caret))}
                isActiveLine={line.num === activeLine?.num}
            />,
        )}
    </div>;
}

interface ProgramTextLineProps {
    text: ProgramText.Text;
    line: ProgramText.Line;
    caretsOnLine: readonly Caret[];
    setCaret(_: Caret, add: boolean): void;
    isActiveLine: boolean;
}

function ProgramTextLine({text, line, caretsOnLine, setCaret, isActiveLine}: ProgramTextLineProps) {
    const NON_BREAKING_SPACE = "\u00A0";
    const ZERO_WIDTH_SPACE = "\u200B";

    const raw = line.raw.replaceAll(" ", NON_BREAKING_SPACE) || ZERO_WIDTH_SPACE;

    const [appState, setAppState] = useContext(AppStateContext);

    let content: React.ReactElement;

    let cssClass = "ProgramTextEditor__Line";
    let contentCssClass = "ProgramTextEditor__Line__Content";
    if (isActiveLine) {
        if (appState.lastExecutionError !== null) {
            // We were the last instruction to attempt to be executed, but it failed!
            cssClass += " ProgramTextEditor__Line--critical";
        } else {
            cssClass += " ProgramTextEditor__Line--active";
        }
    } else if (line instanceof CodeLine && line.instruction instanceof InvalidInstruction) {
        contentCssClass += " ProgramTextEditor__Line__Content--error";
    } else if (line instanceof LabelLine || line instanceof CompositionLine) {
        contentCssClass += " ProgramTextEditor__Line__Content--label";
    }

    let innerCssClass = "ProgramTextEditor__Line__Inner";
    if (caretsOnLine.length > 0) {
        innerCssClass += " ProgramTextEditor__Line__Inner--caret";
    }

    if (caretsOnLine.length > 0) {
        content = <span>
            {caretsOnLine.map(({col}) =>
                <span key={col} style={{zIndex: 10, position: "absolute"}}>
                    <span>{NON_BREAKING_SPACE.repeat(col)}</span>
                    <span className="ProgramTextEditor__Caret"></span>
                </span>,
            )}
            <span>{raw}</span>
        </span>;
    } else {
        content = <span>{raw}</span>;
    }

    const textLineElem = <div className={cssClass} id={"program-text-line-" + line.num}>
        <div className={innerCssClass}>
            <span
                className="ProgramTextEditor__Line__Num">{(line.num + 1).toString().padStart(3, NON_BREAKING_SPACE)}
            </span>
            <span className={contentCssClass} onClick={evt => {
                const lineContentElemBounds = evt.currentTarget.getBoundingClientRect();
                const clickedX = evt.clientX - lineContentElemBounds.x;
                const charWidth = lineContentElemBounds.width / line.raw.length;
                const clickedChar = Math.round(clickedX / charWidth);

                setCaret({
                    row: line.num,
                    col: Math.max(0, Math.min(line.raw.length, clickedChar)),
                }, evt.altKey);
            }}>
                {content}
            </span>
        </div>
    </div>;

    let resultElem = textLineElem;
    if (isActiveLine && appState.lastExecutionError !== null) {
        resultElem = <>
            {textLineElem}
            <div className="ProgramTextEditor__Popout__Wrapper">
                <div className="ProgramTextEditor__Popout">
                    <div className="ProgramTextEditor__Popout__Heading">Whoops!</div>
                    The instruction failed to execute:
                    <span className="ProgramTextEditor__Popout__InternalMessage">
                        {appState.lastExecutionError instanceof ExecutionError ? appState.lastExecutionError.message : appState.lastExecutionError}
                    </span>
                </div>
            </div>
        </>;
    }

    return resultElem;
}

function handleKeyDown(
    evt: KeyboardEvent,
    {editor, setEditor}: ProgramTextFacade,
) {
    if (evt.altKey || evt.metaKey) {
        return;
    }

    const mvMode = evt.ctrlKey ? MovementMode.Word : MovementMode.One;

    switch (evt.key) {
    case "ArrowLeft":
        setEditor(editor.move("left", mvMode));
        break;
    case "ArrowRight":
        setEditor(editor.move("right", mvMode));
        break;
    case "ArrowUp":
        setEditor(editor.move("up", mvMode));
        break;
    case "ArrowDown":
        setEditor(editor.move("down", mvMode));
        break;

    case "Enter": {
        if (!evt.ctrlKey) {
            setEditor(editor.insert("\n"));
        }
        break;
    }

    case "Backspace": {
        setEditor(editor.backspace(mvMode));
        break;
    }

    case "Delete": {
        setEditor(editor.delete(mvMode));
        break;
    }

    default:
        // Handle simple directly-typable characters
        if (!evt.ctrlKey && evt.key.length === 1 && (
            evt.key >= "a" && evt.key <= "z" ||
            evt.key >= "A" && evt.key <= "Z" ||
            evt.key >= "0" && evt.key <= "9" ||
            [" ", ":", "/", "[", "]", "_", "|"].includes(evt.key)
        )) {
            const char = evt.key;

            // TODO: Maybe, if we're in the first word of the line, automatically write in uppercase

            setEditor(editor.insert(char));
            break;
        }

        // Can't handle the event
        return;
    }

    // At this point, it's certain that we've handled the event ourselves
    evt.preventDefault();
    evt.stopPropagation();
}
