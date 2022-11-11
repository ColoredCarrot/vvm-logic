import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {ValueCell} from "../../model/ValueCell";
import {PointerToStackCell} from "../../model/PointerToStackCell";

export class Delbtp extends Instruction {

    constructor() {
        super("DELBTP");
    }

    step(state: State): State {

        const cell = state.stack.get(state.framePointer - 4) as PointerToStackCell;
        state = state.setBacktrackPointer(cell.value);
        return state;
    }

}
