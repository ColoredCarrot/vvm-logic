import {Instruction} from "./Instruction";
import {State} from "../../model/State";

export class Up extends Instruction {

    //Unifikationsstruktur
    private numberB;

    constructor(numberB: number) {
        super("POP");
        this.numberB = numberB;
    }

    step(state: State): State {

        state.stack.pop();
        state.getProgramCounter() = this.numberB;

        return state.garbageCollector.run(state);

    }
}