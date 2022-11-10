import {Instruction} from "./Instruction";
import {State} from "../../model/State";

export class Pop extends Instruction {

    constructor() {
        super("POP");
    }

    step(state: State): State {

        state.stack.pop();

        return state;

    }
}
