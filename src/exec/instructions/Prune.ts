import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {PointerToStackCell} from "../../model/PointerToStackCell";
import {ExecutionError} from "../ExecutionError";

export class Prune extends Instruction {

    constructor() {
        super("PRUNE");
    }

    step(state: State): State {

        const valueCell = state.stack.get(state.framePointer - 4);
        if (!(valueCell instanceof PointerToStackCell)) {
            throw new ExecutionError("Expected cell at FP - 4 to be a pointer-to-stack, but is " + valueCell);
        }

        const value = valueCell.value;

        return state.setBacktrackPointer(value);

    }
}
