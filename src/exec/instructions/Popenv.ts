import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {ValueCell} from "../../model/ValueCell";
import {PointerToStackCell} from "../../model/PointerToStackCell";

export class Popenv extends Instruction {

    constructor() {
        super("POPENV");
    }

    step(state: State): State {
        const currentFP = state.framePointer;
        const fPCell = state.stack.get(currentFP) as ValueCell;
        const paramPC = fPCell.value;
        const savedCell = state.stack.get(state.stack.stackPointer);
        const newFPCell = state.stack.get(state.stack.stackPointer - 2) as PointerToStackCell;
        const valueFP = newFPCell.value;


        if (state.backtrackPointer < state.framePointer) {
            for (let i = 0; i < 8; i++) {
               state = state.modifyStack(stack => stack.pop());
            }
            state = state.pushStack(savedCell);
        }

        state = state.setFramePointer(valueFP);
        state = state.setProgramCounter(paramPC);
        state = state.garbageCollector.run(state);

        return state;
    }

    //TODO: else case testen

}
