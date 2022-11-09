import {Instruction} from "./Instruction";
import {State} from "../../model/State";

export class Bind extends Instruction {

    constructor() {
        super("BIND");
    }

    step(state: State): State {

        state.stack.pop();
        state.stack.pop();

        state = state.garbageCollector.run(state);

        return state;
    }
}
