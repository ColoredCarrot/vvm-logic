import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {ExecutionError} from "../ExecutionError";

export class Unify extends Instruction {


    constructor() {
        super("UNIFY");
    }

    step(state: State): State {
        const topOfStackCell = state.stack.get(state.stack.stackPointer);
        if (!(topOfStackCell instanceof PointerToHeapCell)) {
            throw new ExecutionError("Expected cell on top of stack to be a pointer-to-heap, but is " + topOfStackCell);
        }
        const nextOnStackCell = state.stack.get(state.stack.stackPointer - 1);
        if (!(nextOnStackCell instanceof PointerToHeapCell)) {
            throw new ExecutionError("Expected second-to-last cell on stack to be a pointer-to-heap, but is " + nextOnStackCell);
        }

        const topOfStack = topOfStackCell.value;
        const nextOnStack = nextOnStackCell.value;

        const temp: [State, boolean] = Instruction.unify(state, nextOnStack, topOfStack);

        return temp[0].modifyStack(s => s.pop(2));
        // FIXME: Frage: greift das nur zu wenn unify true ausgibt?? Weil sonst wäre es falsch
    }
}
