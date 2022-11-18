import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {UninitializedCell} from "../../model/UninitializedCell";
import {PointerToStackCell} from "../../model/PointerToStackCell";
import {ValueCell} from "../../model/ValueCell";
import {ExecutionError} from "../ExecutionError";

export class Lastmark extends Instruction {

    constructor() {
        super("LASTMARK");
    }

    step(state: State): State {
        if (state.framePointer <= state.backtrackPointer) {
            const cell = state.stack.get(state.framePointer);
            if (!(cell instanceof ValueCell)) {
                throw new ExecutionError("Expected cell on stack at FP (" + state.framePointer + ") to be a value, but is" + cell);
            }

            return state
                .pushStack(new UninitializedCell())
                .pushStack(new UninitializedCell())
                .pushStack(new UninitializedCell())
                .pushStack(new UninitializedCell())
                .pushStack(new PointerToStackCell(state.framePointer))
                .pushStack(cell);
        } else {
            return state;
        }
    }
}
