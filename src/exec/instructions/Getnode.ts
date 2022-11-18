import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {Cell} from "../../model/Cell";
import {AtomCell} from "../../model/AtomCell";
import {StructCell} from "../../model/StructCell";
import {VariableCell} from "../../model/VariableCell";
import {ExecutionError, IllegalOperationError} from "../ExecutionError";

export class Getnode extends Instruction {

    constructor() {
        super("GETNODE");
    }

    step(state: State): State {
        const SP: number = state.stack.stackPointer;
        const topOfStack: Cell = state.stack.get(SP);
        if (!(topOfStack instanceof PointerToHeapCell)) {
            throw new ExecutionError("Cell at top of stack has to point to heap to execute instruction " + super.instruction);
        }

        const ref: Cell = state.heap.get(topOfStack.value);

        if (!(ref instanceof StructCell) && !(ref instanceof AtomCell) && !(ref instanceof VariableCell)) {
            throw new IllegalOperationError("Ref On top of cell was not of correct Type for Command \"GETNODE\"");
        }

        return state.modifyStack(s => s.set(SP, ref));
    }
}
