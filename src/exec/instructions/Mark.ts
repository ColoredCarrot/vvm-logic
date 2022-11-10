import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {PointerToStackCell} from "../../model/PointerToStackCell";
import {UninitializedCell} from "../../model/UninitializedCell";
import {Cell} from "../../model/Cell";
import {ValueCell} from "../../model/ValueCell";
import {Label} from "../Label";

export class Mark extends Instruction {

    //Kellerahmen anlegen

    private param: Label;
    private cell: Cell = new UninitializedCell();

    constructor(param: Label) {
        super("MARK");
        this.param = param;
        this.cell = 0;
    }

    // S[SP + 5] ← FP; S[SP + 6] ← B; SP ← SP + 6;

    step(state: State): State {
        for (let i = 0; i < 4; i++) {
            state.stack.push(this.cell); // 4 uninitialized cells
        }

        const framePointerCell = new PointerToStackCell(state.getFramePointer());
        const paramCell = new ValueCell(this.param.line);
        state.stack.push(framePointerCell);  //push cell Frame Pointer
        state.stack.push(paramCell);  // push cell mit value address

        return state;
    }

}
