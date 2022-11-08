import {Instruction} from "./Instruction";
import {State} from "../../model/State";

export class Bind extends Instruction {

    constructor() {
        super("BIND");
    }

    step(state: State): State {

        //newState : State
        state.heap.data.set(state.heap.data.get(state.stackPointer-1)+1, state.heap.data.get(state.stackPointer));
        state.stack.pop();
        state.stack.pop();

        state.garbageCollector.run(state);

        return state;
    }
}
