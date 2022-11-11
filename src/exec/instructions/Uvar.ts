import {Instruction} from "./Instruction";
import {State} from "../../model/State";

export class Uvar extends Instruction {

    variable: number;

    constructor(variable: number) {
        super("UVAR " + variable.toString());
        this.variable = variable;
    }

    step(state: State): State {

        return state
            .setStack(
                state.stack
                    .set(state.framePointer + this.variable, state.stack.get(state.stack.stackPointer))
                    .pop()
            );
    }

}
