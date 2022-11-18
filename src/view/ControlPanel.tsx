import React, {useContext} from "react";
import {ExecutionError} from "../exec/ExecutionError";
import {step} from "../exec/step";
import * as ProgramText from "../model/ProgramText";
import {State} from "../model/State";
import {AppStateContext} from "./AppState";
import "./ControlPanel.scss";
import {useGlobalEvent} from "./util/UseGlobalEvent";
import Immutable from "immutable";

interface ControlPanelProps {
    programText: ProgramText.Text;
}

export function ControlPanel({programText}: ControlPanelProps) {

    const [appState, setAppState] = useContext(AppStateContext);

    const vmState = appState.vmState.last() ?? State.new();

    const nextCodeLine = programText.getNextCodeLine(vmState.programCounter);
    const endOfProgram = nextCodeLine === null;

    function invokeStep(): void {
        if (nextCodeLine === null) {
            return;
        }

        let newState: State | null = null;
        try {
            newState = step(vmState.setProgramCounter(nextCodeLine.num - 1), nextCodeLine.instruction);

            for (const oldState of appState.vmState) {
                if (oldState.equals(newState)) {
                    throw new ExecutionError(
                        "Looks like you're stuck in an infinite loop. We stopped the execution for you.",
                        "Executing this instruction yields a state that has already been seen. "
                    );
                }
            }

            setAppState({
                ...appState,
                vmState: appState.vmState.push(newState),
                lastExecutionError: null,
            });
        } catch (ex) {
            if (!(ex instanceof ExecutionError)) {
                console.error("Internal error!", ex);
            }
            const message = ex instanceof Error ? ex.message : JSON.stringify(ex);
            setAppState({
                ...appState,
                lastExecutionError: (ex instanceof ExecutionError ? ex : message),
            });
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
        setAppState({
            vmState: Immutable.List(),
            lastExecutionError: null,
        });
    }}>Restart</a>;

    const btnBackEnabled = !appState.vmState.isEmpty();
    const btnBack = <a
        className={"ControlPanel__button" + (!btnBackEnabled ? " ControlPanel__button--disabled" : "")}
        onClick={() => {
            setAppState({
                ...appState,
                vmState: appState.vmState.pop(),
                lastExecutionError: null,
            });
        }}>Back</a>;

    return <div className="ControlPanel">
        {btnStep}
        {btnRestart}
        {btnBack}
    </div>;
}
