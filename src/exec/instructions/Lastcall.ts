import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {SignLabel} from "../SignLabel";
import {Call} from "./Call";
import {Slide} from "./Slide";
import {Jump} from "./Jump";

export class Lastcall extends Instruction {
    label: SignLabel;
    m: number;

    constructor(p1: SignLabel, p2: number) {
        super("LASTCALL");
        this.label = p1;
        this.m = p2;
    }

    step(state: State): State {
        if (state.framePointer <= state.backtrackPointer) {
            return new Call(this.label).step(state);
        } else {
            state = new Slide(this.m, this.label.size).step(state);
            return new Jump(this.label).step(state);
        }
    }


}
