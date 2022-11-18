import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {PointerToStackCell} from "../../model/PointerToStackCell";
import {ExecutionError} from "../ExecutionError";

export class Delbtp extends Instruction {

    constructor() {
        super("DELBTP");
    }

    step(state: State): State {
        const cell = state.stack.get(state.framePointer - 4);
        if (!(cell instanceof PointerToStackCell)) {
            throw new ExecutionError("Cell in stack at FP - 4, which is " + (state.framePointer - 4) +
                ", must be a PointerToStackCell, but is " + cell);
        }

        return state.setBacktrackPointer(cell.value);

    }

}
