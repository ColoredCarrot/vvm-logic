import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {Cell} from "../../model/Cell";
import {AtomCell} from "../../model/AtomCell";
import {VariableCell} from "../../model/VariableCell";
import {Heap} from "../../model/Heap";

export class Uatom extends Instruction {
    private name: string;

    constructor(param: string) {
        super("UATOM");
        this.name = param;
    }

    step(state: State): State {
        const h: number = (state.stack.get(state.stack.stackPointer) as PointerToHeapCell).value;
        const heapElem: Cell = state.heap.get(h);

        if (heapElem instanceof AtomCell) {
            //Do Nothing
            return state.modifyStack(s => s.pop());
        } else if (heapElem instanceof VariableCell) {
            const [newHeap, address] = state.heap.alloc([new AtomCell(this.name)]);

            return state
                .modifyStack(s => s.pop())
                .setHeap(newHeap)
                .modifyHeap(mh => mh.set(h, new VariableCell(address)))
                .modify(s => Instruction.trail(s, h));
        } else {
            return Instruction.backtrack(state);
        }
    }
}
