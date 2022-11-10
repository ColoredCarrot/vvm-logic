import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {VariableCell} from "../../model/VariableCell";
import {UninitializedCell} from "../../model/UninitializedCell";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";

export class Putanon extends Instruction {

    constructor() {
        super("PUTANON");
    }

    step(state: State): State {

        let [newHeap, address] = state.heap.alloc([new UninitializedCell()])
        state.heap = newHeap.set(address, new VariableCell(address))
        state.stack.push(new PointerToHeapCell(address))

        return state;
    }

}
