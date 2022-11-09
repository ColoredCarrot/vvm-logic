import {Instruction} from "./Instruction";
import {State} from "../../model/State";

export class Call extends Instruction {

    private size: number;
    private dest: number;
    
    constructor( dest: number ) {
        super("CALL "+ dest.toString());
        this.dest = dest
    }

    step(state: State): State {

        state.heap.data.set(state.heap.data.get(state.stackPointer-1)+1,state.heap.data.get(state.stackPointer));
        state.stack.pop();
        state.stack.pop();

        state.garbageCollector.run(state);

        return state;
    }
}

