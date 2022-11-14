import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {PointerToStackCell} from "../../model/PointerToStackCell";

export class Setcut extends Instruction {

    constructor() {
        super("SETCUT");
    }

    step(state: State): State {

        const stack = state.stack.set(state.framePointer - 4, new PointerToStackCell(state.backtrackPointer));
        return state.setStack(stack);
    }

}
