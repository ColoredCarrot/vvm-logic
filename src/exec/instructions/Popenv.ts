import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {ValueCell} from "../../model/ValueCell";
import {PointerToStackCell} from "../../model/PointerToStackCell";
import {ExecutionError} from "../ExecutionError";

export class Popenv extends Instruction {

    constructor() {
        super("POPENV");
    }

    step(state: State): State {

        const currentFP = state.framePointer;
        const fPCell = state.stack.get(currentFP);
        if (!(fPCell instanceof ValueCell)) {
            throw new ExecutionError("Cell on stack at FP (" + currentFP + ") should be a value, but is " + fPCell);
        }

        const paramPC = fPCell.value;
        const savedCell = state.stack.get(state.stack.stackPointer);
        const newFPCell = state.stack.get(state.stack.stackPointer - 2);
        if (!(newFPCell instanceof PointerToStackCell)) {
            throw new ExecutionError("Cell on stack at SP - 2 (" + (state.stack.stackPointer - 2) +
                ") should be a pointer-to-stack, but is " + newFPCell);
        }
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
