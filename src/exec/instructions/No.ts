import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {NoDialog} from "../../model/dialog/NoDialog";

export class No extends Instruction {

    constructor() {
        super("NO");
    }

    step(state: State): State {
        return state.setActiveDialog(new NoDialog());
    }
}
