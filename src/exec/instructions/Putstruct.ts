import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {Cell} from "../../model/Cell";
import {StructCell} from "../../model/StructCell";
import {SignLabel} from "../SignLabel";

export class Putstruct extends Instruction {

    private param: SignLabel;

    constructor(struct: SignLabel) {
        super("PUTSTRUCT " + struct.text);
        this.param = struct;

    }

    step(state: State): State {
        const size = this.param.size;

        const stackPointer = state.stack.size - size + 1;

        // allokiere this.size + 1 Platz auf dem Heap
        const cells: Cell[] = new Array(size + 1);
        const [newHeap, address] = state.heap.alloc(cells);

        // lege Typ Struct mit Wert this.structName auf Heap
        let heap = newHeap;
        heap = heap.set(address, new StructCell(this.param.text, size));

        for (let i = 0; i < size; i++) {
            // lege auf Heap das Element von stage.stack.get(stackPointer+i)
            heap = heap.set(address + 1 + i, state.stack.get(stackPointer + i));
        }

        return state
            .setHeap(heap)
            .setStack(state.stack.pop(size));
    }

}
