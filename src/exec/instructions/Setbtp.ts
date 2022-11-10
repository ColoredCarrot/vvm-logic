import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {UninitializedCell} from "../../model/UninitializedCell";
import {VariableCell} from "../../model/VariableCell";
import {ValueCell} from "../../model/ValueCell";

export class Setbtp extends Instruction {

    constructor() {
        super("SETBTBP");
    }

    step(state: State): State {

        state.stack.set(state.getFramePointer() - 2, new ValueCell(state.getHeapPointer()));
        state.stack.set(state.getFramePointer() - 3, new ValueCell(state.getTrailPointer()));
        state.stack.set(state.getFramePointer() - 4, new ValueCell(state.getBacktrackPointer()));
        state.setBacktrackPointer(state.getFramePointer());

        return state;
    }

}
