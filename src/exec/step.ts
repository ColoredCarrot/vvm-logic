import {State} from "../model/State";

/**
 * Step from one machine state to the next by parsing and processing the given instruction.
 */
export function step(state: State, instruction: string): State {
    console.log("Step " + instruction);
    return {...state, programCounter: state.programCounter + 1};
}
