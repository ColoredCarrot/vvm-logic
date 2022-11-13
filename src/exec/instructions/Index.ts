import {Instruction} from "./Instruction";
import {SignLabel} from "../SignLabel";
import {State} from "../../model/State";
import {Cell} from "../../model/Cell";

export class Index extends Instruction {
    private pred: SignLabel;

    constructor(p: SignLabel) {
        super("INDEX " + p);
        this.pred = p;
    }

    step(state: State): State {
        const topOfStack: Cell = state.stack.get(state.stack.stackPointer);
        const cont = "";
        const newPC = state.tryChain.get(this.pred, cont);

        return state.modifyStack(s => s.pop())
            .setProgramCounter(newPC);
    }
}
