import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {StructCell} from "../../model/StructCell";
import {ExecutionError} from "../ExecutionError";

export class Son extends Instruction {

    constructor(private readonly i: number) {
        super("SON " + i);
    }

    step(state: State): State {
        const topStackCell = state.stack.get(state.stack.stackPointer);
        if (!(topStackCell instanceof PointerToHeapCell)) {
            throw new ExecutionError("Expected the cell at the top of the stack to be a PointerToHeapCell, but is " + topStackCell);
        }

        const theRef = topStackCell.value;

        const structCell = state.heap.get(theRef);
        if (!(structCell instanceof StructCell)) {
            throw new ExecutionError("Expected reference on top of the stack to point to a Struct, but it points to " + structCell);
        }

        if (this.i > structCell.size || this.i < 1) {
            throw new ExecutionError("<" + this.i + "> out of range for Struct " + structCell.label);
        }

        const cellToDup = state.heap.get(theRef + this.i);
        if (!(cellToDup instanceof PointerToHeapCell)) {
            throw new ExecutionError("Expected " + this.i + "th element of Struct " + structCell.label + " to be a PointerToHeapCell, but is " + cellToDup);
        }

        const resultingRef = Instruction.deref(state, cellToDup.value);
        return state.pushStack(new PointerToHeapCell(resultingRef));
    }
}
