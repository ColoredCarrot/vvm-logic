import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";

export class Uref extends Instruction {
    private i: number;


    constructor(i: number) {
        super("UREF " + i);
        this.i = i;
    }

    step(state: State): State {
        const topOfStack: number = (state.stack.get(state.stack.stackPointer) as PointerToHeapCell).value;
        const fpi: number = (state.stack.get(state.framePointer + this.i) as PointerToHeapCell).value;

        const temp: [State, boolean] = Instruction.unify(state, topOfStack, fpi);

        return temp[0].modifyStack(s => s.pop());
    }
}
