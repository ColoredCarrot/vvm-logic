import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {Cell} from "../../model/Cell";

export class Slide extends Instruction {
    m: number;
    h: number;

    constructor(m: number, h: number) {
        super("SLIDE " + m + " " + h);
        this.m = m;
        this.h = h;
    }

    step(state: State): State {
        const refs: Cell[] = [];
        for (let i = 0; i < this.h; i++) {
            refs.push(state.stack.pop());
        }

        for (let i = 0; i < this.m; i++) {
            state.stack.pop();
        }

        for (let i = 0; i < this.h; i++) {
            state.stack.push(refs.pop()!);
        }

        return state;
    }
}
