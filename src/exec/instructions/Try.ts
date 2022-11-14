import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {Label} from "../Label";
import {ValueCell} from "../../model/ValueCell";

export class Try extends Instruction {

    value: Label;

    constructor(value: Label) {
        super("TRY");
        this.value = value;

    }

    step(state: State): State {

        return state.setStack(state.stack.set(state.framePointer - 5, new ValueCell(state.programCounter))).setProgramCounter(this.value.line);

    }
}
