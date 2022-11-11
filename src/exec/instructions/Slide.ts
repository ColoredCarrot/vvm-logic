import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {Cell} from "../../model/Cell";

export class Slide extends Instruction {
    constructor(readonly m: number, readonly h: number) {
        super("SLIDE " + m + " " + h);
    }

    step(state: State): State {
        const refs: Cell[] = [];

        //Copy Refs off the stack
        for (let i = 0; i < this.h; i++) {
            refs.push(state.stack.get(state.stack.stackPointer - this.h + 1 + i));
        }

        //Remove h+m from stack and push refs again
        return state
            .modifyStack(s => s.pop(this.m + this.h))
            .modifyStack(s => {
                for (const cell of refs) {
                    s = s.push(cell);
                }
                return s;
            });
    }
}
