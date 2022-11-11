import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {ValueCell} from "../../model/ValueCell";

export class Check  extends Instruction {

    private readonly number: number;

    constructor(number: number) {
        super("CHECK");
        this.number = number;
    }

    step(state: State): State {
        const valueCell = state.stack.get(state.stack.stackPointer) as ValueCell;
        const value = valueCell.value;

        if (!Check.check(state, value, Check.deref(state, state.framePointer + this.number))) {
            Check.backtrack(state);
        }

        return state;
    }

}
