import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {ValueCell} from "../../model/ValueCell";
import {PointerToStackCell} from "../../model/PointerToStackCell";

export class Prune extends Instruction {

    constructor() {
        super("PRUNE");
    }

    step(state: State): State {

        const valueCell = state.stack.get(state.framePointer - 4) as PointerToStackCell;
        const value = valueCell.value;

        state = state.setBacktrackPointer(value);

        return state;

    }
}
