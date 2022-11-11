import {Instruction} from "./Instruction";
import {State} from "../../model/State";

export class Fail extends Instruction {


    constructor() {
        super("FAIL");
    }

    step(state: State): State {
        return Instruction.backtrack(state);
    }
}
