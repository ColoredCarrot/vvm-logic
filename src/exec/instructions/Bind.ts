import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";

export class Bind extends Instruction {

    constructor() {
        super("BIND");
    }

    step(state: State): State {

        let secondCell : PointerToHeapCell = state.stack.get(state.stack.size - 1) as PointerToHeapCell

        state.heap.set(secondCell.value, state.stack.get(state.stack.size))
        state = Instruction.trail(state, secondCell.value)

        state.stack.pop();
        state.stack.pop();

        return state;
    }


}
