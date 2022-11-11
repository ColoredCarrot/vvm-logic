import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {Label} from "../Label";

export class Up extends Instruction {

    constructor(private readonly label: Label) {
        super("UP " + label.text);
    }

    step(state: State): State {
        return state
            .modifyStack(s => s.pop())
            .setProgramCounter(this.label.line)
            .modify(s => s.garbageCollector.run(s));
    }
}
