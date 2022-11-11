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
        const topOfStack: number = (<PointerToHeapCell>state.stack.get(state.stack.stackPointer)).value;
        const ref: number = (<PointerToHeapCell>state.stack.get(state.framePointer + this.i)).value;

        if (!Instruction.check(state, topOfStack,
            Instruction.deref(state, ref))) {
            return Instruction.backtrack(state);
        }

        return state;
    }
}
