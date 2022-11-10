import {State} from "../../model/State";
import {Cell} from "../../model/Cell";
import {VariableCell} from "../../model/VariableCell";

export abstract class Instruction {
    protected constructor(public instruction: string) {}

    abstract step(state: State): State;

    public static unify(state : State, u : number, v : number) : boolean {
        return false;
    }

    public static trail (state : State, u : number) {

    }

    public static backtrack(state : State) {

    }

    public static reset(state : State, x : number, y : number) {

    }

    public static check(state : State, u : number, v : number) : boolean {
        return false;
    }

    public static deref(state : State, v : number) : number {
        let other : Cell = state.heap.get(v)!

        if(other instanceof VariableCell && other.value != v) {
            return this.deref(state, other.value)
        } else {
            return v
        }
    }
}
