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
        const pcCell = state.stack.get(state.framePointer);
        if (!(pcCell instanceof ValueCell)) {
            throw new ExecutionError("Cell on stack at FP (" + state.framePointer + ") should be a value, but is " + pcCell);
        }

        const fpCell = state.stack.get(state.framePointer - 1);
        if (!(fpCell instanceof PointerToStackCell)) {
            throw new ExecutionError("Cell on stack at FP - 1 (" + (state.framePointer - 1) + ") should be a pointer-to-stack, but is " + fpCell);
        }

        if (state.framePointer > state.backtrackPointer) {
            state = state.modifyStack(s => s.setStackPointer(state.framePointer - 6));
        }

        return state
            .setProgramCounter(pcCell.value)
            .setFramePointer(fpCell.value)
            .modify(state.garbageCollector.run);
    }
}
