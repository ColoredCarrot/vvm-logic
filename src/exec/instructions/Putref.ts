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

        const stackCell: PointerToHeapCell = state.stack.get(state.framePointer + this.reference) as PointerToHeapCell;
        const address: number = Instruction.deref(state, stackCell.value);

        return state
            .pushStack(new PointerToHeapCell(address));
    }

}
