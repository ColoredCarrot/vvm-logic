import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {Label} from "../Label";

export class Up extends Instruction {

    //Unifikationsstruktur
    private label: Label;

    constructor(label: Label) {
        super("POP");
        this.label = label;
    }

    step(state: State): State {

        state.stack.pop();
        state.setProgramCounter(this.label.line);

        return state.garbageCollector.run(state);

    }
}
