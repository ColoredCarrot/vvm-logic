import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {UninitializedCell} from "../../model/UninitializedCell";
import {VariableCell} from "../../model/VariableCell";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";

export class Putvar extends Instruction {

    variable: number;

    constructor(variable: number) {
        super("PUTVAR " + variable.toString());
        this.variable = variable;
    }

    step(state: State): State {
        const [newHeap, address] = state.heap.alloc([new UninitializedCell()]);

        return state
            .setHeap(newHeap.set(address, new VariableCell(address)))
            .setStack(
                state.stack
                    .push(new PointerToHeapCell(address))
                    .set(state.framePointer + this.variable, new PointerToHeapCell(address))
            );
    }
}
