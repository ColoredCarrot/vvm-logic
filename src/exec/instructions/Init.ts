import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {Label} from "../Label";

export class Init extends Instruction {

    private label: Label;

    constructor(label: Label) {
        super("INIT " + label.text);
        this.label = label;
    }

    step(state: State): State {
        return state;
    }
}
