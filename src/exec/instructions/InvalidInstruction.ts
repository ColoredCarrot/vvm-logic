import { State } from "../../model/State";
import {Instruction} from "./Instruction";

export class InvalidInstruction extends Instruction {
    instruction : string


    constructor(instruction: string) {
        super(instruction);
        this.instruction = instruction;
    }

    step(state: State): State {
        return state;
    }

}