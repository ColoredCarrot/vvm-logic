import {State} from "../../model/State";
import {Cell} from "../../model/Cell";
import {VariableCell} from "../../model/VariableCell";
import {StructCell} from "../../model/StructCell";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";

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
        if(u === v) {
            return false;
        }

        let start = state.heap.get(v);
        if (start instanceof StructCell) {
            for (let i = 1; i <= start.size; i++) {
                let cellInStruct = state.heap.get(v + i);
                if(! (cellInStruct instanceof PointerToHeapCell)) {
                    throw new Error("Heap Cell in Struct is not os type PointerToHeapCell!")
                }
                if(!this.check(state, u,  this.deref(state, cellInStruct.value))) {
                    return false;
                }
            }
        }

        return true;
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
