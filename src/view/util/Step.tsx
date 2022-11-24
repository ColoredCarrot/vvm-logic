import {step as computeStep} from "../../exec/step";
import {State} from "../../model/State";
import {ExecutionError} from "../../exec/ExecutionError";
import {AppState} from "../AppState";
import * as ProgramText from "../../model/ProgramText";

export function changeVmState(appState: AppState, f: (_: State) => State): AppState {
    try {
        const origVmState = appState.vmState.last() ?? State.new();
        const newVmState = f(origVmState);

        // Might have been a NOP
        if (origVmState.equals(newVmState)) {
            return appState;
        }

        for (const oldState of appState.vmState) {
            if (oldState.equals(newVmState)) {
                throw new ExecutionError(
                    "Looks like you're stuck in an infinite loop. We stopped the execution for you.",
                    "Executing this instruction yields a state that has already been seen. "
                );
            }
        }

        return {
            ...appState,
            vmState: appState.vmState.push(newVmState),
            lastExecutionError: null,
        };
    } catch (ex) {
        if (!(ex instanceof ExecutionError)) {
            console.error("Internal error!", ex);
        }
        const message = ex instanceof Error ? ex.message : JSON.stringify(ex);

        return {
            ...appState,
            lastExecutionError: (ex instanceof ExecutionError ? ex : message),
            autoStepEnabled: false, // Stop auto-step when any error occurs
        };
    }
}

export function step(codeLine: ProgramText.CodeLine, appState: AppState, setAppState: (_: AppState) => void): AppState {
    const newAppState = changeVmState(appState, vmState => {
        if (vmState.activeDialog !== null) {
            // Cannot step while there is a modal dialog
            return vmState;
        }

        return computeStep(vmState.setProgramCounter(codeLine.num), codeLine.instruction);
    });
    setAppState(newAppState);
    return newAppState;
}
