import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {HaltDialog} from "../../model/dialog/HaltDialog";

export class Halt extends Instruction {

    constructor() {
        super("HALT");
    }

    step(state: State): State {
        //TODO
        return state.setActiveDialog(new HaltDialog(["foo", "bar"]));
    }
}
