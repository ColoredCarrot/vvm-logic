import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {Cell} from "../../model/Cell";
import {StructCell} from "../../model/StructCell";

export class Putstruct extends Instruction {

    structName: string;
    size: number;

    constructor(structName: string) {
        super("PUTSTRUCT " + structName);
        this.structName = structName;
        this.size = Number(structName.substring(structName.indexOf("/") + 1));
    }

    step(state: State): State {

        const stackPointer = state.stack.size - this.size + 1;

        // allokiere this.size + 1 Platz auf dem Heap
        const cells: Cell[] = new Array(this.size + 1);
        const [newHeap, address] = state.heap.alloc(cells);

        // lege Typ Struct mit Wert this.structName auf Heap
        let heap = newHeap;
        heap = heap.set(address, new StructCell(this.structName, this.size));

        for (let i = 0; i < this.size; i++) {
            // lege auf Heap das Element von stage.stack.get(stackPointer+i)
            heap = heap.set(address + 1 + i, state.stack.get(stackPointer + i));
        }

        return state
            .setHeap(heap)
            .setStack(state.stack.pop(this.size));
    }

}
