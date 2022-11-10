import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {Label} from "../Label";
import {ValueCell} from "../../model/ValueCell";

export class Try extends Instruction {


    constructor(value: Label) {
        super("TRY");
        this;
    }

    step(state: State): State {

        state.stack.set(state.framePointer - 5, new ValueCell(state.getProgramCounter()));

        return state;
    }
}
