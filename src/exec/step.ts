import {State} from "../model/State";
import {Instruction} from "./instructions/Instruction";

/**
 * Step from one machine state to the next by parsing and processing the given instruction.
 */
export function step(state: State, instruction: Instruction): State {
    return state
        .setActiveDialog(null)
        .setProgramCounter(state.programCounter + 1)
        .modify(instruction.step.bind(instruction));
}
