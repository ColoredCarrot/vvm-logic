import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {ExecutionError} from "../ExecutionError";

export class Putref extends Instruction {

    reference: number;

    constructor(reference: number) {
        super("PUTREF " + reference.toString());
        this.reference = reference;
    }

    step(state: State): State {

        const stackCell = state.stack.get(state.framePointer + this.reference);
        if (!(stackCell instanceof PointerToHeapCell)) {
            throw new ExecutionError("Expected cell at FP + " + this.reference + " to be a pointer-to-heap, but is " + stackCell);
        }

        const address: number = Instruction.deref(state, stackCell.value);

        return state
            .pushStack(new PointerToHeapCell(address));
    }

}
