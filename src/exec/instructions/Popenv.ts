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
        let currentFP: number = state.getFramePointer();
        let fPCell: ValueCell = state.stack.get(currentFP) as ValueCell;
        let paramPC: number = fPCell.getValue();
        let savedCell: Cell = state.stack.get(state.stack.size() - 1);

        let newFPCell: ValueCell = state.stack.get(state.getFramePointer()-1) as ValueCell;
        let valueFP: number = newFPCell.getValue();


        if(state.getBacktrackPointer() < state.getFramePointer()) {
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
