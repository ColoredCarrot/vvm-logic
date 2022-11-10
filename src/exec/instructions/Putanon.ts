import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {VariableCell} from "../../model/VariableCell";
import {UninitializedCell} from "../../model/UninitializedCell";

export class Putanon extends Instruction {

    constructor() {
        super("PUTANON");
    }

    step(state: State): State {

        // allokiere Platz für eine Zelle auf Heap
        // lege Cell mit Typ Variable auf den Heap mit Wert der Adresse von Heap (= Selbstreferenz)
        // increase the HeapPointer um 1 (macht Heap!)

        const [newHeap, address] = state.heap.alloc([new UninitializedCell()]);

        return state
            .setHeap(newHeap.set(address, new VariableCell(address)));

        //state.stack.push(Adresse von Heap, ist Pointer zu Heap)
    }

}
