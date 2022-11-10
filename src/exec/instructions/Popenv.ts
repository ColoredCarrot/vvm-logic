import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {Cell} from "../../model/Cell";
import {ValueCell} from "../../model/ValueCell";

export class Popenv extends Instruction {

    /**
     *
     */
    constructor() {
        super("POPENV");
    }

    step(state: State): State {
        const currentFP = state.getFramePointer();
        const fPCell = state.stack.get(currentFP) as ValueCell;
        const paramPC = fPCell.getValue();
        const savedCell = state.stack.get(state.stack.size() - 1);
        const newFPCell = state.stack.get(state.getFramePointer() - 1) as ValueCell;
        const valueFP = newFPCell.getValue();


        if (state.getBacktrackPointer() < state.getFramePointer()) {
            for (let i = 0; i < 7; i++) {
                state.stack.pop();
            }
            state.stack.push(savedCell);
        }

        state.setFramePointer(valueFP);
        state.setProgramCounter(paramPC);

        state.garbageCollector.run(state);

        return state;
    }

}
