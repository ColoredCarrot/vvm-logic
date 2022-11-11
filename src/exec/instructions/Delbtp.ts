import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {ValueCell} from "../../model/ValueCell";

export class Delbtp extends Instruction {

    constructor() {
        super("DELBTP");
    }

    step(state: State): State {

        //Was ist wenn die Zelle keine  Value hat?
        const cell = state.stack.get(state.framePointer - 4) as ValueCell;
        state.setBacktrackPointer(cell.getValue());
        return state;
    }

}
