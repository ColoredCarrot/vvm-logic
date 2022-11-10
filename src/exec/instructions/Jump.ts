import {Instruction} from "./Instruction";
import {Label} from "../Label";
import {State} from "../../model/State";

export class Jump extends Instruction {

    label: Label;

    constructor(label: Label) {
        super("jump" + label.text);
        this.label = label;
    }

    step(state: State): State {
        return state.setProgramCounter(this.label.line);
    }
}
