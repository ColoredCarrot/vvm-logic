import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {UninitializedCell} from "../../model/UninitializedCell";
import {VariableCell} from "../../model/VariableCell";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";

export class Putvar extends Instruction {

    variable: number;

    constructor(variable: number) {
        super("PUTVAR " + variable.toString());
        this.variable = variable;
    }

    step(state: State): State {

        let [newHeap, address] = state.heap.alloc([new UninitializedCell()])
        state.heap = newHeap.set(address, new VariableCell(address))
        state.stack.push(new PointerToHeapCell(address))
        state.stack.set(state.framePointer + this.variable, new PointerToHeapCell(address))

        return state;
    }

}
