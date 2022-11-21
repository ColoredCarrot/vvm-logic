import React, {useContext} from "react";
import {TextEditor} from "../model/text/TextEditor";
import {step} from "./util/Step";
import {State} from "../model/State";
import {AppState, AppStateContext, ProgramTextContext} from "./AppState";
import "./ControlPanel.scss";
import {useGlobalEvent} from "./util/UseGlobalEvent";
import Immutable from "immutable";

export function ControlPanel() {

    const [appState, setAppState] = useContext(AppStateContext);
    const {programText, setEditor} = useContext(ProgramTextContext);

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

    const btnStep = <a
        className={"ControlPanel__button" + (endOfProgram && " ControlPanel__button--disabled" || "")}
        onClick={() => invokeStep()}
    >
        <img src="/icons/nextStep_dark.svg" alt="Step"/>
    </a>;

    const btnRun = <a
        className="ControlPanel__button"
        onClick={() => invokeRun()}
    >
        {appState.autoStepEnabled ? <img src="/icons/pause_dark.svg" alt="Stop"/> : <img src="/icons/execute_dark.svg" alt="Run"/>}
    </a>;

    const btnRestart = <a className="ControlPanel__button" onClick={() => {
        setAppState({
            ...appState,
            vmState: Immutable.List(),
            lastExecutionError: null,
        });
    }}>
        <img src="/icons/restart_dark.svg" alt="Restart"/>
    </a>;

    const btnBackEnabled = !appState.vmState.isEmpty();
    const btnBack = <a
        className={"ControlPanel__button" + (!btnBackEnabled ? " ControlPanel__button--disabled" : "")}
        onClick={() => invokeBack()}>
        <img src="/icons/undo_dark.svg" alt="Undo"/>
    </a>;

    const btnOpen = <a className="ControlPanel__button">
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
            <img src="/icons/menu-open_dark.svg" alt="Open..."/>
        </label>
    </a>;

    return <div className="ControlPanel">
        {btnOpen}
        {btnRun}
        {btnStep}
        {btnBack}
        {btnRestart}
    </div>;
}
