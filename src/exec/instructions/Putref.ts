import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";

export class Putref extends Instruction {

    reference: number;

    constructor(reference: number) {
        super("PUTREF " + reference.toString());
        this.reference = reference;
    }

    step(state: State): State {

        let address: number = Instruction.deref(state,state.framePointer + this.reference);
        state.stack.push(new PointerToHeapCell(address));
        return state;
    }

}
