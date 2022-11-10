import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";

export class Bind extends Instruction {

    constructor() {
        super("BIND");
    }

    step(state: State): State {

        const secondCell = state.stack.get(state.stack.stackPointer) as PointerToHeapCell;

        return state
            .setHeap(state.heap.set(secondCell.value, state.stack.get(state.stack.stackPointer)))
            .modify(s => Instruction.trail(s, secondCell.value))
            .modifyStack(stack => stack.pop(2));
    }
}
