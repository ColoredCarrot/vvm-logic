import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {ExecutionError} from "../ExecutionError";

export class Uref extends Instruction {

    constructor(private readonly i: number) {
        super("UREF " + i);
        this.i = i;
    }

    step(state: State): State {
        const topOfStackCell = state.stack.get(state.stack.stackPointer);
        if (!(topOfStackCell instanceof PointerToHeapCell)) {
            throw new ExecutionError("Expected cell at top of stack to be a pointer-to-heap, but is " + topOfStackCell);
        }

        const topOfStack: number = topOfStackCell.value;
        const fpiCell = state.stack.get(state.framePointer + this.i);
        if (!(fpiCell instanceof PointerToHeapCell)) {
            throw new ExecutionError("Expected cell at FP + " + this.i + " to be a pointer-to-heap, but is " + fpiCell);
        }
        const fpi: number = fpiCell.value;

        const temp: [State, boolean] = Instruction.unify(state, topOfStack, fpi);

        return temp[0].modifyStack(s => s.pop());
    }
}
