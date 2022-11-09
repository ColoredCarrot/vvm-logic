import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {UninitializedCell} from "../../model/UninitializedCell";

export class Pushenv extends Instruction {

    //reserviert Speicherplatz für lokale Variabeln
    private mVar: number;
    private cell: UninitializedCell = new UninitializedCell();


    constructor(mVar: number) {
        super("PUSHENV");
        this.mVar = mVar;
    }

    step(state: State): State {

        let n: number = state.stack.size - state.framePointer;
        let allocVar: number = n - this.mVar;

        for (let i = 0; i < allocVar - 1 ; i++) {
            state.stack.push(this.cell);
        }

        return state;
    }

}
