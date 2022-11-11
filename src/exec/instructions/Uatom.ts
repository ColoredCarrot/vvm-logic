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
        const h: number = (<PointerToHeapCell>state.stack.get(state.stack.stackPointer)).value;
        const temp = state.modifyStack(s => s.pop());
        const heapElem: Cell = state.heap.get(h);

        if (heapElem instanceof AtomCell) {
            //Do Nothing
            return temp;
        } else if (heapElem instanceof VariableCell) {
            const tempHeap = state.heap;
            const newAtom: [Heap, number] = tempHeap.alloc([new AtomCell(this.name)]);

            return state.modifyTrail(t => t.push(h))
                .setHeap(newAtom[0])
                .modifyHeap(mh => mh.set(h, new VariableCell(newAtom[1])));

        } else {
            return Instruction.backtrack(state);
        }
    }
}
