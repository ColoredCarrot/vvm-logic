import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {UninitializedCell} from "../../model/UninitializedCell";
import {PointerToStackCell} from "../../model/PointerToStackCell";
import {ValueCell} from "../../model/ValueCell";

export class Lastmark extends Instruction {


    constructor() {
        super("LASTMARK");
    }

    step(state: State): State {
        if (state.framePointer <= state.backtrackPointer) {
            const framePointer = state.framePointer;
            const stackAtFramePointer = (<ValueCell>state.stack.get(state.framePointer)).value;

            return state.modifyStack(s => s.push(new UninitializedCell()))
                .modifyStack(s => s.push(new UninitializedCell()))
                .modifyStack(s => s.push(new UninitializedCell()))
                .modifyStack(s => s.push(new UninitializedCell()))
                .modifyStack(s => s.push(new PointerToStackCell(framePointer)))
                .modifyStack(s => s.push(new ValueCell(stackAtFramePointer)));
        } else {
            return state;
        }
    }
}
