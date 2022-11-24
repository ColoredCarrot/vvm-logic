import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {Label} from "../Label";
import {ValueCell} from "../../model/ValueCell";

export class Try extends Instruction {

    constructor(readonly value: Label) {
        super("TRY");
    }

    step(state: State): State {
        return state
            .modifyStack(s => s.set(state.framePointer - 5, new ValueCell(state.programCounter, "PC")))
            .setProgramCounter(this.value.line);
    }
}
