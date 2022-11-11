import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {ValueCell} from "../../model/ValueCell";

export class Setbtp extends Instruction {

    constructor() {
        super("SETBTBP");
    }

    step(state: State): State {

        state.stack.set(state.framePointer - 2, new ValueCell(state.heap.getHeapPointer()));
        state.stack.set(state.framePointer - 3, new ValueCell(state.trail.trailPointer));
        state.stack.set(state.framePointer - 4, new ValueCell(state.backtrackPointer));
        state.setBacktrackPointer(state.framePointer);

        return state;
    }

}
