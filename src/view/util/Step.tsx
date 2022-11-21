import {step as computeStep} from "../../exec/step";
import {State} from "../../model/State";
import {ExecutionError} from "../../exec/ExecutionError";
import {AppState} from "../AppState";
import * as ProgramText from "../../model/ProgramText";

export function step(codeLine: ProgramText.CodeLine, appState: AppState, setAppState: (_: AppState) => void): AppState {

    const vmState = appState.vmState.last() ?? State.new();

    let newState: State | null = null;
    let newAppState: AppState;
    try {
        newState = computeStep(vmState.setProgramCounter(codeLine.num - 1), codeLine.instruction);

        for (const oldState of appState.vmState) {
            if (oldState.equals(newState)) {
                throw new ExecutionError(
                    "Looks like you're stuck in an infinite loop. We stopped the execution for you.",
                    "Executing this instruction yields a state that has already been seen. "
                );
            }
        }

        newAppState = {
            ...appState,
            vmState: appState.vmState.push(newState),
            lastExecutionError: null,
        };
    } catch (ex) {
        if (!(ex instanceof ExecutionError)) {
            console.error("Internal error!", ex);
        }
        const message = ex instanceof Error ? ex.message : JSON.stringify(ex);

        newAppState = {
            ...appState,
            lastExecutionError: (ex instanceof ExecutionError ? ex : message),
        };
    }

    setAppState(newAppState);
    return newAppState;
}
