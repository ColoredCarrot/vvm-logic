import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {PointerToStackCell} from "../../model/PointerToStackCell";
import {ValueCell} from "../../model/ValueCell";
import {UninitializedCell} from "../../model/UninitializedCell";

export class Mark extends Instruction {

    private readonly addressB: number;

    constructor(address: number) {
        super("MARK");
        this.addressB = address;
    }

    // S[SP + 5] ← FP; S[SP + 6] ← B; SP ← SP + 6;

    step(state: State): State {
        // 4 uninitialized cells
        let stack = state.stack;
        for (let i = 0; i < 4; i++) {
            stack = stack.push(new UninitializedCell());
        }

        stack = stack
            .push(new ValueCell(state.framePointer))
            .push(new PointerToStackCell(this.addressB));

        return state.setStack(stack);
    }
}
