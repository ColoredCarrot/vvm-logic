import {Instruction} from "./Instruction";
import {State} from "../../model/State";

export class Fail  extends Instruction {

    //TODO: Die neue Instruktion fail ist für alle Konstruktoren außer [ ] und [|] zuständig??

    constructor() {
        super("FAIL");
    }

    step(state: State): State {
        Fail.backtrack(state);
        return state;
    }

}
