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
        const topOfStack: number = (<PointerToHeapCell>state.stack.get(state.stack.stackPointer)).value;
        const fpi: number = (<PointerToHeapCell>state.stack.get(state.framePointer + this.i)).value;

        const temp: [State, boolean] = Instruction.unify(state, topOfStack, fpi);

        return temp[0].modifyStack(s => s.pop());
    }
}
