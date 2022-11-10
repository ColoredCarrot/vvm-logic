import {Instruction} from "./Instruction";
import {State} from "../../model/State";

export class Slide extends Instruction {
    //TODO: Just dummy of class

    constructor(m: number, h: number) {
        super("SLIDE");
    }

    step(state: State): State {
        return state;
    }
}
