import React, {useContext} from "react";
import {ExecutionError} from "../exec/ExecutionError";
import {step} from "../exec/step";
import * as ProgramText from "../model/ProgramText";
import {State} from "../model/State";
import {AppStateContext} from "./AppState";
import "./ControlPanel.css";
import {useGlobalEvent} from "./util/UseGlobalEvent";

interface ControlPanelProps {
    vmState: State;

    setVmState(newState: State): void;

    programText: ProgramText.Text;
}

export function ControlPanel({vmState, setVmState, programText}: ControlPanelProps) {

    const [appState, setAppState] = useContext(AppStateContext);

    const endOfProgram = vmState.programCounter + 1 >= programText.codeLineCount;

    function invokeStep(): void {
        if (endOfProgram) {
            return;
        }

        let newState: State | null = null;
        try {
            newState = step(vmState, programText.getCodeLine(vmState.programCounter + 1)!.instruction);
            if (newState !== null) {
                setVmState(newState);
            }
            setAppState({...appState, lastExecutionError: null});
        } catch (ex) {
            if (!(ex instanceof ExecutionError)) {
                console.error("Internal error!", ex);
            }
            const message = ex instanceof Error ? ex.message : JSON.stringify(ex);
            setAppState({...appState, lastExecutionError: (ex instanceof ExecutionError ? ex : message)});
        }
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
        className={"ControlPanel__button" + (endOfProgram && " ControlPanel__button--disabled" || "")}
        onClick={() => invokeStep()}
    >Step (F8)</a>;
    const btnRestart = <a className="ControlPanel__button" onClick={() => {
        setAppState({...appState, lastExecutionError: null});
        setVmState(State.new());
    }}>Restart</a>;

    return <div className="ControlPanel">
        {btnStep}
        {btnRestart}
    </div>;
}
