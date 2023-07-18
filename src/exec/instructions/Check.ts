import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";

export class Check extends Instruction {

    private readonly i: number;

    constructor(i: number) {
        super("CHECK " + i);
        this.i = i;
    }

    step(state: State): State {
        const topOfStack: number = (state.stack.get(state.stack.stackPointer) as PointerToHeapCell).value;
        const ref: number = (state.stack.get(state.framePointer + this.i) as PointerToHeapCell).value;

        if (!Instruction.check(state, topOfStack,
            Instruction.deref(state, ref))) {
            return Instruction.backtrack(state);
        }

        return state;
    }
}
