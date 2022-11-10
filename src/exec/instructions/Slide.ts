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

        //Copy Refs off the stack
        for (let i = 0; i < this.h; i++) {
            //refs = [1, 2, 3, 4]
            refs.push(state.stack.get(state.stack.stackPointer - this.h + i));
        }

        //Remove h+m from stack and push refs again
        return state.modifyStack(s => s.pop(this.m + this.h))
            .modifyStack(s => {
                for (const cell in refs) {
                    s = s.push(cell);
                }
                return s;
            });
    }
}
