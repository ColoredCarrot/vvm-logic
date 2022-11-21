import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import Immutable, {OrderedMap} from "immutable";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {ExecutionError} from "../ExecutionError";

export class Halt extends Instruction {
    readonly d: number;
    
    constructor(d: number) {
        super("HALT " + d);
        this.d = d;
    }

    step(state: State): State {
        const bindings: Map<number, string> = new Map<number, string>();
        if (this.d != 0) {
            for (let i = 6; i < 6 + this.d; i++) {
                const cellOnStack = state.stack.get(i);
                if (!(cellOnStack instanceof PointerToHeapCell)) {
                    throw new ExecutionError("Expected Cells at Result to point to Heap");
                } else {
                    const res = Instruction.deref(state, cellOnStack.value);
                    bindings.set(i, this.bindingsFor(state, res));
                }
            }
        }
        //TODO: Add Bingings to State and show state it needs to present them

        return state;
    }

    private bindingsFor(state: State, addr: number): string {

        return "";
    }
}
