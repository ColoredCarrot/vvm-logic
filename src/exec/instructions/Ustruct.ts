import {Instruction} from "./Instruction";
import {SignLabel} from "../SignLabel";
import {Label} from "../Label";
import {State} from "../../model/State";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {StructCell} from "../../model/StructCell";
import {VariableCell} from "../../model/VariableCell";
import {ExecutionError} from "../ExecutionError";

export class Ustruct extends Instruction {
    private p0: SignLabel;
    private p1: Label;

    constructor(p0: SignLabel, p1: Label) {
        super("USTRUCT " + p0.text + " " + p1.text);
        this.p0 = p0;
        this.p1 = p1;
    }

    step(state: State): State {
        const cell = state.stack.get(state.stack.stackPointer);
        if (!(cell instanceof PointerToHeapCell)) {
            throw new ExecutionError("Expected cell at top of stack to be a pointer-to-heap, but is " + cell);
        }

        const ref = cell.value;
        const heapElem = state.heap.get(ref);
        if (heapElem instanceof StructCell) {
            //DO Nothing
            return state;
        } else if (heapElem instanceof VariableCell) {
            return state.setProgramCounter(this.p1.line);
        } else {
            return Instruction.backtrack(state);
        }
    }
}
