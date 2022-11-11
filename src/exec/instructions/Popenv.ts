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
        const currentFP = state.framePointer;
        const fPCell = state.stack.get(currentFP) as ValueCell;
        const paramPC = fPCell.getValue();
        const savedCell = state.stack.get(state.stack.stackPointer - 1);
        const newFPCell = state.stack.get(state.framePointer - 1) as ValueCell;
        const valueFP = newFPCell.getValue();


        if (state.backtrackPointer < state.backtrackPointer) {
            for (let i = 0; i < 7; i++) {
                state = state.modifyStack(stack => stack.pop());
            }
            state.pushStack(savedCell);
        }

        state = state.setFramePointer(valueFP);
        state = state.setProgramCounter(paramPC);

        state.garbageCollector.run(state);

        return state;
    }

}
