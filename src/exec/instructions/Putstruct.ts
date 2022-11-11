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
        const newStackPointer = state.stack.stackPointer - size;

        const cells: Cell[] = new Array(size + 1);
        const [newHeap, address] = state.heap.alloc(cells);

        let heap = newHeap;
        heap = heap.set(address, new StructCell(this.param.text, size));

        for (let i = 0; i < size; i++) {
            heap = heap.set(address + 1 + i, state.stack.get(newStackPointer + i));
        }

        return state
            .setHeap(heap)
            .setStack(state.stack.pop(size));
    }

}
