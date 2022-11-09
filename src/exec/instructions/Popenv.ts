import {Instruction} from "./Instruction";
import {State} from "../../model/State";

export class Popenv extends Instruction {

    //backtrackpointer?!

    constructor() {
        super("POPENV");
    }

    step(state: State): State {

        return state;
    }

}