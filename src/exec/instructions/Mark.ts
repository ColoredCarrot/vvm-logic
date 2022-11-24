import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {PointerToStackCell} from "../../model/PointerToStackCell";
import {Label} from "../Label";
import {UninitializedCell} from "../../model/UninitializedCell";
import {ValueCell} from "../../model/ValueCell";

export class Mark extends Instruction {

    private readonly param: Label;

    constructor(param: Label) {
        super("MARK " + param);
        this.param = param;
    }

    // S[SP + 5] ← FP; S[SP + 6] ← B; SP ← SP + 6;

    step(state: State): State {
        //4 uninitialized cell
        let stack = state.stack;
        for (let i = 0; i < 4; i++) {
            stack = stack.push(new UninitializedCell());
        }

        stack = stack
            .push(new PointerToStackCell(state.framePointer))
            .push(new ValueCell(this.param.line, "PC"));

        return state.setStack(stack);
    }
}
