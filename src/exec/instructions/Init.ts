import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {ValueCell} from "../../model/ValueCell";
import {UninitializedCell} from "../../model/UninitializedCell";
import {Label} from "../Label";

export class Init extends Instruction {

    private readonly param: Label;

    constructor(label: Label) {
        super("INIT " + label);
        this.param = label;
    }

    step(state: State): State {

        return state
            .setFramePointer(5)
            .setBacktrackPointer(5)
            .pushStack(new ValueCell(this.param.line, "PC"))
            .pushStack(new ValueCell(-1))
            .pushStack(new ValueCell(-1))
            .pushStack(new ValueCell(state.heap.getHeapPointer(), "HP"))
            .pushStack(new UninitializedCell())
            .pushStack(new UninitializedCell());

    }
}
