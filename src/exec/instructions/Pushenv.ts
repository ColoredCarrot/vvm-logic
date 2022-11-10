import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {UninitializedCell} from "../../model/UninitializedCell";
import {Cell} from "../../model/Cell";

export class Pushenv extends Instruction {

    //reserviert Speicherplatz für lokale Variabeln
    private readonly mVar: number;
    private readonly cell: Cell = new UninitializedCell();

    constructor(mVar: number) {
        super("PUSHENV");
        this.mVar = mVar;
    }

    step(state: State): State {

        const n: number = state.stack.stackPointer - state.framePointer;
        const allocVar: number = n - this.mVar;

        let stack = state.stack;
        for (let i = 0; i < allocVar - 1; i++) {
            stack = stack.push(this.cell);
        }

        return state.setStack(stack);
    }

}
