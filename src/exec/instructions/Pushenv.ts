import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {UninitializedCell} from "../../model/UninitializedCell";
import {Cell} from "../../model/Cell";

export class Pushenv extends Instruction {

    //reserviert Speicherplatz für lokale Variabeln

    private mVar: number;
    cell: Cell = new UninitializedCell();

    constructor(mVar: number) {
        super("PUSHENV");
        this.mVar = mVar;
    }

    step(state: State): State {

        const number = state.stack.getStackPointer() - state.getFramePointer();
        const allocVar = number - this.mVar;

        for (let i = 0; i < allocVar - 1; i++) {
            state.stack.push(this.cell);

        }

        return state;
    }

}
