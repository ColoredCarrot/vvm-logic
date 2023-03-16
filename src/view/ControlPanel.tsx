import React, {useContext} from "react";
import {TextEditor} from "../model/text/TextEditor";
import {step} from "./util/Step";
import {State} from "../model/State";
import {AppState, AppStateContext, ProgramTextContext} from "./AppState";
import "./ControlPanel.scss";
import {useGlobalEvent} from "./util/UseGlobalEvent";
import Immutable from "immutable";
import ReactTooltip from "react-tooltip";
import {Parsing} from "../parser/Parsing";
import {CodeGenerator} from "../parser/CodeGenerator";
import {Program} from "../parser/model/Program";
import iconCwmTerminateDark from "./icons/cwmTerminate_dark.svg";
import iconExecuteDark from "./icons/execute_dark.svg";
import iconMenuOpenDark from "./icons/menu-open_dark.svg";
import iconNextStepDark from "./icons/nextStep_dark.svg";
import iconPauseDark from "./icons/pause_dark.svg";
import iconRestartDark from "./icons/restart_dark.svg";
import iconUndoDark from "./icons/undo_dark.svg";

export function ControlPanel() {

    const [appState, setAppState] = useContext(AppStateContext);
    const {programText, editor, setEditor} = useContext(ProgramTextContext);

    const vmState = appState.vmState.last() ?? State.new();

    const nextCodeLine = programText.getNextCodeLine(vmState.programCounter);
    const endOfProgram = nextCodeLine === null;

    function invokeStep(): AppState {
        return nextCodeLine !== null
            ? step(nextCodeLine, appState, setAppState)
            : appState;
    }

    function invokeBack(): void {
        if (!appState.vmState.isEmpty()) {
            setAppState({
                ...appState,
                vmState: appState.vmState.pop(),
                lastExecutionError: null,
            });
        }
    }

    function invokeRun() {
        setAppState({
            // We enabled auto-step; useInterval() will perform the first step after the delay has passed once already,
            // but we want to step immediately:
            ...(appState.autoStepEnabled ? appState : invokeStep()),
            autoStepEnabled: !appState.autoStepEnabled,
        });
    }

    useGlobalEvent("keydown", evt => {
        switch (evt.key) {
        case "F9":
            invokeRun();
            break;
        case "F8":
            invokeStep();
            break;
        case "F7":
            invokeBack();
            break;
        default:
            // We don't handle this key combination
            return;
        }

        // We did handle the event
        evt.stopPropagation();
        evt.preventDefault();
    });

    const btnStepDisabled = endOfProgram || vmState.activeDialog !== null;
    const btnStep = <a
        data-tip={"Step (F8)"}
        className={"ControlPanel__button" + (btnStepDisabled ? " ControlPanel__button--disabled" : "")}
        onClick={() => invokeStep()}
    >
        <img src={iconNextStepDark} alt="Step"/>
    </a>;

    const btnRun = <a
        data-tip={"Run (F9)"}
        className="ControlPanel__button"
        onClick={() => invokeRun()}
    >
        {appState.autoStepEnabled ? <img src={iconPauseDark} alt="Stop"/> : <img src={iconExecuteDark} alt="Run"/>}
    </a>;

    const btnRestart = <a className="ControlPanel__button" data-tip={"Restart"} onClick={() => {
        setAppState({
            ...appState,
            vmState: Immutable.List(),
            lastExecutionError: null,
        });
    }}>
        <img src={iconRestartDark} alt="Restart"/>
    </a>;

    const btnBackEnabled = !appState.vmState.isEmpty();
    const btnBack = <a
        data-tip={"Step Back (F7)"}
        className={"ControlPanel__button" + (!btnBackEnabled ? " ControlPanel__button--disabled" : "")}
        onClick={() => invokeBack()}>
        <img src={iconUndoDark} alt="Undo"/>
    </a>;

    const btnOpen = <div className="ControlPanel__button ControlPanel__button--dropdown">
        <a>
            <input
                id="open-file-input"
                type="file"
                accept=".txt,.wim"
                onChange={evt => {
                    evt.preventDefault();
                    evt.stopPropagation();
                    const file = evt.target.files?.[0];
                    if (file) {
                        const fileReader = new FileReader();
                        fileReader.onload = (loadEvt => {
                            const src = loadEvt.target!.result as string;
                            setEditor(TextEditor.forText(src));
                        });
                        fileReader.readAsText(file);
                    }
                }}
            />
            <label htmlFor="open-file-input">
                <img src={iconMenuOpenDark} alt="Open..."/>
            </label>

            <input
                id="compile-file-input"
                type="file"
                onChange={evt => {
                    evt.preventDefault();
                    evt.stopPropagation();
                    const file = evt.target.files?.[0];
                    if (file) {
                        const fileReader = new FileReader();
                        fileReader.onload = (loadEvt => {
                            const src = loadEvt.target!.result as string;
                            let parseTree: Program;
                            try {
                                parseTree = Parsing.parse(src);
                            } catch (ex) {
                                console.error("Failed to parse program", ex);
                                window.alert("Failed to parse program: " + ex);
                                return;
                            }
                            let parsedText: string;
                            try {
                                parsedText = new CodeGenerator().code_Program(parseTree);
                            } catch (ex) {
                                console.error("Codegen failed", ex);
                                window.alert("Codegen failed: " + ex);
                                return;
                            }
                            setEditor(TextEditor.forText(parsedText));
                        });
                        fileReader.readAsText(file);
                    }
                }}
            />
        </a>
        <div className="dropdown-menu">
            <div>
                <label
                    htmlFor="open-file-input"
                    className="ControlPanel__button ControlPanel__button--stretch"
                >Open…</label>
            </div>
            <div>
                <label
                    htmlFor="compile-file-input"
                    className="ControlPanel__button ControlPanel__button--stretch"
                >Compile…</label>
            </div>
            <div>
                <a
                    className="ControlPanel__button ControlPanel__button--stretch"
                    onClick={() => openSaveAsDialog(editor.text)}
                >Save As…</a>
            </div>
        </div>
    </div>;

    const btnClear = <a
        data-tip={"Clear Text"}
        className="ControlPanel__button"
        onClick={() => setEditor(TextEditor.create())}>
        <img src={iconCwmTerminateDark} alt="Clear"/>
    </a>;

    const popout = !appState.autoStepEnabled ? undefined : <div className="ControlPanel__Popout">
        <div className="ControlPanel__Popout__Content">
            <div className="ControlPanel__Popout__Content__Line">
                <label htmlFor="auto-step-speed-input">Speed:</label>
                <input
                    id="auto-step-speed-input"
                    type="range"
                    className="ControlPanel__Popout__Content__slider"
                    min={0} max={1} step="any"
                    value={appState.autoStepSpeed}
                    onChange={evt => setAppState({
                        ...appState,
                        autoStepSpeed: Math.max(0, Math.min(1, evt.target.valueAsNumber)),
                    })}
                />
            </div>
        </div>
    </div>;

    return <div className="ControlPanel">
        <div>
            <ReactTooltip place={"bottom"} effect={"solid"} delayShow={500}/>
            {btnOpen}
            {btnRun}
            {btnStep}
            {btnBack}
            {btnRestart}
            {btnClear}
        </div>

        {popout}
    </div>;
}

function openSaveAsDialog(text: string, filename = "program.wim") {
    const a = document.createElement("a");
    a.setAttribute("style", "display: none");
    document.body.appendChild(a);
    a.href = "data:text/plain," + encodeURIComponent(text);
    a.download = filename;
    a.click();
    a.remove();
}
