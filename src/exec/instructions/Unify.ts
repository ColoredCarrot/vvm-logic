import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";

export class Unify extends Instruction {


    constructor() {
        super("UNIFY");
    }

    step(state: State): State {
        const topOfStack = (<PointerToHeapCell>state.stack.get(state.stack.stackPointer)).value;
        const nextOnStack = (<PointerToHeapCell>state.stack.get(state.stack.stackPointer - 1)).value;

        Instruction.unify(state, nextOnStack, topOfStack);

        return state.modifyStack(s => s.pop(2));
    }
}