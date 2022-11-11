import {Instruction} from "./Instruction";
import {State} from "../../model/State";

export class No extends Instruction {

    constructor() {
        super("NO");
    }

    step(state: State): State {
        //TODO: HALT AUFRUF
        return state;
    }
}
