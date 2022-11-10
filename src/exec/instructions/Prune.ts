import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {ValueCell} from "../../model/ValueCell";

export class Prune extends Instruction {

    constructor() {
        super("PRUNE");
    }

    step(state: State): State {

        const valueCell = state.stack.get(state.getFramePointer() - 4) as ValueCell;
        const value = valueCell.getValue();

        state.setBacktrackPointer(value);

        return state;

    }
}