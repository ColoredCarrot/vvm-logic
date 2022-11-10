import {Instruction} from "./Instruction";
import {State} from "../../model/State";

export class Putref extends Instruction {

    reference: number;

    constructor(reference: number) {
        super("PUTREF " + reference.toString());
        this.reference = reference;
    }

    step(state: State): State {

        // stackPointer increased!
        state.stack.push(state.stack.get(state.framePointer + this.reference));

        return state;
    }

}
