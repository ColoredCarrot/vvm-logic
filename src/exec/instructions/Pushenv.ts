import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {UninitializedCell} from "../../model/UninitializedCell";
import {Cell} from "../../model/Cell";

export class Pushenv extends Instruction {

    readonly mVar: number;
    private readonly cell: Cell = new UninitializedCell();

    constructor(mVar: number) {
        super("PUSHENV");
        this.mVar = mVar;
    }

    step(state: State): State {

        const n = state.stack.stackPointer - state.framePointer;
        const allocVar = this.mVar - n;

        let stack = state.stack;
        for (let i = 0; i < allocVar; i++) {
            stack = stack.push(this.cell);
        }

        return state.setStack(stack);
    }

}
