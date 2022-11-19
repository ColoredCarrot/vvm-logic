import React, {useContext} from "react";
import {step} from "./util/Step";
import {State} from "../model/State";
import {AppStateContext, ProgramTextContext} from "./AppState";
import "./ControlPanel.scss";
import {useGlobalEvent} from "./util/UseGlobalEvent";
import Immutable from "immutable";

export function ControlPanel() {

    const [appState, setAppState] = useContext(AppStateContext);
    const {programText, setProgramTextFromExternal} = useContext(ProgramTextContext);

    const vmState = appState.vmState.last() ?? State.new();

    const nextCodeLine = programText.getNextCodeLine(vmState.programCounter);
    const endOfProgram = nextCodeLine === null;

    function invokeStep(): void {
        if (nextCodeLine !== null) {
            step(nextCodeLine, appState, setAppState);
        }
    }

    function invokeRun() {
        setAppState({
            ...appState,
            autoStepEnabled: !appState.autoStepEnabled,
        });
    }

    useGlobalEvent("keydown", evt => {
        if (evt.key === "F8") {
            invokeStep();
        } else {
            return;
        }

        // We did handle the event
        evt.stopPropagation();
        evt.preventDefault();
    });

    const btnStep = <a
        className={"ControlPanel__button" + (endOfProgram ? " ControlPanel__button--disabled" : "")}
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
        onClick={() => {
            setAppState({
                ...appState,
                vmState: appState.vmState.pop(),
                lastExecutionError: null,
            });
        }}>
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
                const file = evt.target.files?.[0] ?? null;
                if (file !== null) {
                    const fileReader = new FileReader();
                    fileReader.onload = (loadEvt => {
                        const src = loadEvt.target!.result as string;
                        setProgramTextFromExternal(src);
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
