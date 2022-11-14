import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";

export class Unify extends Instruction {


    constructor() {
        super("UNIFY");
    }

    step(state: State): State {
        const topOfStack = (state.stack.get(state.stack.stackPointer) as PointerToHeapCell).value;
        const nextOnStack = (state.stack.get(state.stack.stackPointer - 1) as PointerToHeapCell).value;

        const temp: [State, boolean] = Instruction.unify(state, nextOnStack, topOfStack);

        return temp[0].modifyStack(s => s.pop(2));
    }
}
