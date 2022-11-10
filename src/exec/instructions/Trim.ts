import {Instruction} from "./Instruction";
import {State} from "../../model/State";

export class Trim extends Instruction {

    numberM: number;

    constructor(numberEntry: number) {
        super("TRY");
        this.numberM = numberEntry;

    }

    step(state: State): State {

        const number1 = state.stack.getStackPointer() - state.getFramePointer();
        const number2 = number1 - this.numberM;

        if(state.getFramePointer() >= state.getBacktrackPointer()){
            for (let i = 0; i <  number2; i++) {
                state.stack.pop();
            }
        }
        return state;
    }
}
