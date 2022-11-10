import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {Cell} from "../../model/Cell";
import {StructCell} from "../../model/StructCell";

export class Putstruct extends Instruction {

    structName : string;
    size : number;

    constructor(structName: string) {
        super("PUTSTRUCT "+structName);
        this.structName = structName;
        this.size = +structName.substring(structName.indexOf("/")+1)
    }

    step(state: State): State {

        let stackPointer = state.stack.size - this.size + 1

        // allokiere this.size + 1 Platz auf dem Heap
        let cells:Cell[] = new Array(this.size + 1)
        let [newHeap, address] = state.heap.alloc(cells)

        // lege Typ Struct mit Wert this.structName auf Heap
        newHeap.set(address, new StructCell(this.structName, this.size))

        for (let i = 0; i < this.size; i++) {
            // lege auf Heap das Element von stage.stack.get(stackPointer+i)
            newHeap.set(address+1+i, state.stack.get(stackPointer+i))
        }

        state.heap = newHeap;

        for (let i = 0; i < this.size; i++) {
            // danach entferne size Elemente von Stack
            state.stack.pop();
        }

        return state;
    }

}