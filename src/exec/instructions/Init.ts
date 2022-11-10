import {Instruction} from "./Instruction";
import {State} from "../../model/State";

export class Init extends Instruction {

    private addr: number;

    constructor(addr: number) {
        super("INIT");
        this.addr = addr;
    }

    step(state: State): State {

        return state;
    }
}