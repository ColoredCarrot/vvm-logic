import {Instruction} from "./Instruction";
import {State} from "../../model/State";

export class Pop extends Instruction {

    constructor() {
        super("POP");
    }

    step(state: State): State {
        state = state.setStack(state.stack.pop());
        state = state.garbageCollector.run(state);
        return state;
    }
}
