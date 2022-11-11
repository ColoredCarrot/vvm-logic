import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {ValueCell} from "../../model/ValueCell";

export class Prune extends Instruction {

    constructor() {
        super("PRUNE");
    }

    step(state: State): State {

        const valueCell = state.stack.get(state.framePointer - 4) as ValueCell;
        const value = valueCell.getValue();

        state = state.setBacktrackPointer(value);

        return state;

    }
}
