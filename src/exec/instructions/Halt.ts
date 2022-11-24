import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {ExecutionError} from "../ExecutionError";
import {AtomCell} from "../../model/AtomCell";
import {VariableCell} from "../../model/VariableCell";
import {StructCell} from "../../model/StructCell";
import {HaltDialog} from "../../model/dialog/HaltDialog";

export class Halt extends Instruction {

    constructor(readonly d: number) {
        super("HALT " + d);
    }

    step(state: State): State {
        const bindings: string[] = [];
        if (this.d != 0) {
            for (let i = 6; i < 6 + this.d; i++) {
                const cellOnStack = state.stack.get(i);
                if (!(cellOnStack instanceof PointerToHeapCell)) {
                    throw new ExecutionError("Expected Cells at Result to point to Heap");
                } else {
                    const res = Instruction.deref(state, cellOnStack.value);
                    bindings.push(this.bindingsFor(state, res));
                }
            }
        }

        return state.setActiveDialog(new HaltDialog(bindings));
    }

    private bindingsFor(state: State, addr: number): string {
        const result = state.heap.get(addr);
        if (result instanceof AtomCell) {
            return result.value;
        }
        if (result instanceof VariableCell) {
            return "_" + result.value;
        }
        if (result instanceof StructCell) {
            const name = result.label;
            if (name === "[|]/2") {
                //Special case for binary Constructor
                const deref1 = Instruction.deref(state, addr + 1);
                const deref2 = Instruction.deref(state, addr + 2);
                return "[" + this.bindingsFor(state, deref1) + "|" + this.bindingsFor(state, deref2) + "]";
            } else {
                //General Structure
                const nameWOSize = name.split("/")[0];
                let ret = nameWOSize + "(";
                for (let i = 1; i < result.size; i++) {
                    //Add Bindings for all struct cells
                    const derefI = Instruction.deref(state, addr + i);
                    ret += this.bindingsFor(state, derefI);
                    ret += ", ";
                }
                //Add Binding for last struct cell
                const derefLast = Instruction.deref(state, addr + result.size);
                ret += this.bindingsFor(state, derefLast);
                ret += ")";
                return ret;
            }


        }

        throw new ExecutionError("Halt expects Reference to Variable, Atom or struct, but was " + JSON.stringify(result));
    }
}
