import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {ValueCell} from "../../model/ValueCell";
import {UninitializedCell} from "../../model/UninitializedCell";

export class Init extends Instruction {

    private readonly addr: number;

    constructor(addr: number) {
        super("INIT");
        this.addr = addr;
    }

    step(state: State): State {
        state = state.setFramePointer(5);
        state = state.setBacktrackPointer(5);

        state.stack.push(new ValueCell(this.addr));
        state.stack.push(new ValueCell(-1));
        state.stack.push(new ValueCell(-1));
        state.stack.push(new ValueCell(0));
        state.stack.push(new UninitializedCell());
        state.stack.push(new UninitializedCell());

        return state;
    }
}
