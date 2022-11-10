import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {UninitializedCell} from "../../model/UninitializedCell";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {AtomCell} from "../../model/AtomCell";

export class Putatom extends Instruction {

    atom: string;

    constructor(atom: string) {
        super("PUTATOM " + atom);
        this.atom = atom;
    }

    step(state: State): State {
        const [newHeap, address] = state.heap.alloc([new UninitializedCell()]);
        state = state.setHeap(newHeap.set(address, new AtomCell(this.atom)));
        state = state.setStack(state.stack.push(new PointerToHeapCell(address)));

        return state;
    }

}
