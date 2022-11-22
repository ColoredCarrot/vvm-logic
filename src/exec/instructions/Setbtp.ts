import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {ValueCell} from "../../model/ValueCell";
import {PointerToStackCell} from "../../model/PointerToStackCell";

export class Setbtp extends Instruction {

    constructor() {
        super("SETBTBP");
    }

    step(state: State): State {

        return state.setStack(state.stack
            .set(state.framePointer - 2, new ValueCell(state.heap.heapPointer, "HP"))
            .set(state.framePointer - 3, new ValueCell(state.trail.trailPointer, "TP"))
            .set(state.framePointer - 4, new PointerToStackCell(state.backtrackPointer)))
            .setBacktrackPointer(state.framePointer);

    }

}
