import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {UninitializedCell} from "../../model/UninitializedCell";
import {PointerToStackCell} from "../../model/PointerToStackCell";
import {ValueCell} from "../../model/ValueCell";

export class Lastmark extends Instruction {

    constructor() {
        super("LASTMARK");
    }

    step(state: State): State {
        if (state.framePointer <= state.backtrackPointer) {
            return state
                .pushStack(new UninitializedCell())
                .pushStack(new UninitializedCell())
                .pushStack(new UninitializedCell())
                .pushStack(new UninitializedCell())
                .pushStack(new PointerToStackCell(state.framePointer))
                .pushStack(state.stack.get(state.framePointer) as ValueCell);
        } else {
            return state;
        }
    }
}
