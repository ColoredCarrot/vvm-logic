import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {ValueCell} from "../../model/ValueCell";
import {UninitializedCell} from "../../model/UninitializedCell";
import {Label} from "../Label";

export class Init extends Instruction {

    private readonly label: Label;

    constructor(label: Label) {
        super("INIT");
        this.label = label;
    }

    step(state: State): State {
        state = state.setFramePointer(5);
        state = state.setBacktrackPointer(5);


        state = state.pushStack(new ValueCell(this.label.line));
        state = state.pushStack(new ValueCell(-1));
        state = state.pushStack(new ValueCell(-1));
        state = state.pushStack(new ValueCell(0));
        state = state.pushStack(new UninitializedCell());
        state = state.pushStack(new UninitializedCell());

        return state;
    }
}
