import {Instruction} from "./Instruction";
import {State} from "../../model/State";

export class Call extends Instruction {

    private size: number;
    private dest: number;

    constructor(dest: number) {
        //FIXME
        super("CALL " + dest.toString());
        this.dest = dest;
        this.size = 1;
    }

    step(state: State): State {

        //state.heap = state.heap.set(state.heap.get(state.stack.size - 2) + 1, state.heap.get(state.stack.size - 1))

        state.stack.pop();
        state.stack.pop();

        state = state.garbageCollector.run(state);

        return state;
    }
}
