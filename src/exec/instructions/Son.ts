import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {Cell} from "../../model/Cell";
import {StructCell} from "../../model/StructCell";
import {ExecutionError} from "../ExecutionError";

export class Son extends Instruction {
    private readonly i: number;

    constructor(i: number) {
        super("SON " + i);
        this.i = i;
    }

    step(state: State): State {
        const refOnTop: number = (<PointerToHeapCell>state.stack.get(state.stack.stackPointer)).value;

        const heapElem: Cell = state.heap.get(refOnTop);

        if (heapElem instanceof StructCell) {
            if (this.i > heapElem.size || this.i < 1) {
                throw new ExecutionError("<" + this.i + "> out of Range for Struct " + heapElem.label);
            } else {
                const structI: number = (<PointerToHeapCell>state.heap.get(refOnTop + this.i)).value;
                return state.modifyStack(s => s.push(new PointerToHeapCell(structI)));
            }
        } else {
            throw new ExecutionError("Expect reference on Stack top to point to Struct for Instruction son i");
        }
    }
}
