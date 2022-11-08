import {State} from "../../model/State";

export abstract class Instruction {
    protected constructor(public instruction: string) {}

    abstract step(state: State): State;
}
