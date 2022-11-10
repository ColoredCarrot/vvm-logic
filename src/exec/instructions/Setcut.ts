import {Instruction} from "./Instruction";
import {State} from "../../model/State";

export class Setcut extends Instruction {

    constructor() {
        super("SETCUT");
    }

    step(state: State): State {

        state.stack.set(state.getFramePointer() - 4, state.getBacktrackPointer());

        return state;
    }

}
