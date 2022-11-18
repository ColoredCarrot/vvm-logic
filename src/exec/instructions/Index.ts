import {Instruction} from "./Instruction";
import {SignLabel} from "../SignLabel";
import {State} from "../../model/State";
import {Cell} from "../../model/Cell";
import {VariableCell} from "../../model/VariableCell";
import {AtomCell} from "../../model/AtomCell";
import {StructCell} from "../../model/StructCell";
import {ExecutionError} from "../ExecutionError";

export class Index extends Instruction {
    private readonly pred: SignLabel;

    constructor(p: SignLabel) {
        super("INDEX " + p);
        this.pred = p;
    }

    step(state: State): State {
        const topOfStack: Cell = state.stack.get(state.stack.stackPointer);
        state = state.modifyStack(s => s.pop());
        let newPC = -1;

        if (topOfStack instanceof VariableCell) {
            newPC = state.tryChain.get(this.pred, "r");
        } else if (topOfStack instanceof AtomCell) {
            newPC = state.tryChain.get(this.pred, topOfStack.value);
        } else if (topOfStack instanceof StructCell) {
            newPC = state.tryChain.get(this.pred, topOfStack.label);
        } else {
            throw new ExecutionError("" + topOfStack.toJSON() + " is not a valid Cell at top of stack for" +
                " instruction " + super.instruction);
        }

        return state.setProgramCounter(newPC);
    }
}
