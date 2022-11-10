import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {ValueCell} from "../../model/ValueCell";

export class Pushenv extends Instruction {

    //reserviert Speicherplatz für lokale Variabeln
    private mVar: number;
    private cell: ValueCell = new ValueCell(undefined);

    constructor(mVar: number) {
        super("PUSHENV");
        this.mVar = mVar;
    }

    step(state: State): State {

        const n: number = state.stack.size - state.getFramePointer();
        const allocVar: number = n - this.mVar;

        for (let i = 0; i < allocVar - 1; i++) {

            state.stack.push(this.cell);
        }

        return state;
    }

}
