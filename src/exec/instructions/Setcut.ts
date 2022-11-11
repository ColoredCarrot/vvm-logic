import {Instruction} from "./Instruction";
import {State} from "../../model/State";

export class Setcut extends Instruction {

    constructor() {
        super("SETCUT");
    }

    step(state: State): State {

        state = state.setBacktrackPointer(state.framePointer - 4);
        return state;
    }

}
