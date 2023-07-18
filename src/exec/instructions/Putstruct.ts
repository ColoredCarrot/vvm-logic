import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {Cell} from "../../model/Cell";
import {StructCell} from "../../model/StructCell";
import {SignLabel} from "../SignLabel";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {ExecutionError} from "../ExecutionError";

export class Putstruct extends Instruction {

    private param: SignLabel;

    constructor(struct: SignLabel) {
        super("PUTSTRUCT " + struct.text);
        this.param = struct;

    }

    step(state: State): State {

        const size = this.param.size;
        const newStackPointer = state.stack.stackPointer - size + 1;

        const cells: Cell[] = new Array<Cell>(size + 1);
        const [newHeap, address] = state.heap.alloc(cells);

        let heap = newHeap;
        heap = heap.set(address, new StructCell(this.param.text, size));

        for (let i = 1; i <= size; i++) {
            const cell = state.stack.get(newStackPointer + i - 1);
            if (!(cell instanceof PointerToHeapCell)) {
                throw new ExecutionError("Expected cell on stack at " + (newStackPointer + i - 1) + " to be a pointer-to-heap, but is " + cell);
            }
            heap = heap.set(address + i, cell);
        }

        return state
            .setHeap(heap)
            .setStack(state.stack.pop(size))
            .pushStack(new PointerToHeapCell(address));
    }

}
