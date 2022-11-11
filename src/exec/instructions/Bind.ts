import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {VariableCell} from "../../model/VariableCell";

export class Bind extends Instruction {

    constructor() {
        super("BIND");
    }

    step(state: State): State {

        const firstCell = state.stack.get(state.stack.stackPointer) as VariableCell
        const secondCell = state.stack.get(state.stack.stackPointer - 1) as PointerToHeapCell;

        return state
            .setHeap(state.heap.set(secondCell.value, new VariableCell(firstCell.value)))
            .modify(s => Instruction.trail(s, secondCell.value))
            .modifyStack(stack => stack.pop(2));
    }
}
