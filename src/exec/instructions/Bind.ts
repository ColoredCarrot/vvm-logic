import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {VariableCell} from "../../model/VariableCell";
import {ExecutionError} from "../ExecutionError";

export class Bind extends Instruction {

    constructor() {
        super("BIND");
    }

    step(state: State): State {

        const firstCell = state.stack.get(state.stack.stackPointer);
        if (!(firstCell instanceof VariableCell)) {
            throw new ExecutionError("Expected cell on top of stack to be a variable, but is " + firstCell);
        }

        const secondCell = state.stack.get(state.stack.stackPointer - 1);
        if (!(secondCell instanceof PointerToHeapCell)) {
            throw new ExecutionError("Expected second-to-last cell on stack to be a pointer-to-heap, but is " + secondCell);
        }

        return state
            .setHeap(state.heap.set(secondCell.value, new VariableCell(firstCell.value)))
            .modify(s => Instruction.trail(s, secondCell.value))
            .modifyStack(stack => stack.pop(2));
    }
}
