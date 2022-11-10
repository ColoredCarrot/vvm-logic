import {State} from "../../model/State";
import {Cell} from "../../model/Cell";
import {VariableCell} from "../../model/VariableCell";
import {StructCell} from "../../model/StructCell";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {ValueCell} from "../../model/ValueCell";
import {PointerToStackCell} from "../../model/PointerToStackCell";
import {AtomCell} from "../../model/AtomCell";

export abstract class Instruction {
    protected constructor(public instruction: string) {}

    abstract step(state: State): State;


    public static unify(state: State, u: number, v: number): boolean {
        if (u === v) {
            return true;
        }
        const heapAtU: Cell = state.heap.get(u);
        const heapAtV: Cell = state.heap.get(v);
        if (heapAtU instanceof VariableCell) {
            if (heapAtV instanceof VariableCell) {
                if (u > v) {
                    state.heap.set(u, new VariableCell(v));
                    this.trail(state, u);
                    return true;
                } else {
                    state.heap.set(v, new VariableCell(u));
                    this.trail(state, v);
                    return true;
                }
            } else if (this.check(state, u, v)) {
                state.heap.set(v, new VariableCell(u));
                this.trail(state, u);
                return true;
            } else {
                this.backtrack(state);
                return false;
            }
        }
        if (heapAtV instanceof VariableCell) {
            if (this.check(state, v, u)) {
                state.heap.set(v, new VariableCell(u));
                this.trail(state, v);
                return true;
            } else {
                this.backtrack(state);
                return false;
            }
        }
        if (heapAtV instanceof AtomCell && heapAtU instanceof AtomCell
            && heapAtU.value === heapAtV.value) {
            return true;
        }
        if (heapAtU instanceof StructCell && heapAtV instanceof StructCell
            && heapAtV.label === heapAtU.label) {
            const n = heapAtU.size;
            for (let i = 1; i <= n; i++) {
                const heapAtUpI = (<PointerToHeapCell>state.heap.get(u + i)).value;
                const heapAtVpI = (<PointerToHeapCell>state.heap.get(v + i)).value;

                if (!this.unify(state,
                    this.deref(state, heapAtUpI),
                    this.deref(state, heapAtVpI))) {
                    return false;
                }
            }
            return true;
        }
        this.backtrack(state);
        return false;
    }

    public static backtrack(state: State) {
        //Reset Frame Pointer
        state.setFramePointer(state.getBacktrackPointer());

        //Reset Heap Pointer
        const oldHeapPointer: ValueCell = <ValueCell>state.stack.get(state.getFramePointer() - 2);
        state.setHeapPointer(oldHeapPointer.value);

        //Reset Trail Pointer and reset()
        const oldTrailPointer: ValueCell = <ValueCell> state.stack.get(state.getFramePointer() - 3);
        this.reset(state, oldTrailPointer.value, state.getTrailPointer());
        state.setTrailPointer(oldTrailPointer.value);

        //Set PC to negative Continuation address
        const negativeCont: PointerToStackCell = <PointerToStackCell> state.stack.get(state.getFramePointer() - 5);
        state.setProgramCounter(negativeCont.value);

    }

    public static trail(state: State, u: number) {
        const onStack: Cell = state.stack.get(state.backtrackPointer - 2);
        if (!(onStack instanceof ValueCell)) {
            throw new Error("Expected Heap Pointer on Stack to be Type ValueCell!");
        } else {
            state.trail.push(u);
        }
    }

    /**
     * Reset Objects on Heap to unbound variable
     * @param state - state of wim
     * @param x - reset variables on heap addresses [y:x]
     * @param y -
     */
    public static reset(state: State, x: number, y: number) {
        for (let u = y; x < u; u--) {
            const resetCell: number = state.trail.at(u)!;
            const resetTo: Cell = new VariableCell(resetCell);

            state.heap.set(resetCell, resetTo);
        }
    }

    public static check(state: State, u: number, v: number): boolean {
        if (u === v) {
            return false;
        }

        const start = state.heap.get(v);
        if (start instanceof StructCell) {
            for (let i = 1; i <= start.size; i++) {
                const cellInStruct = state.heap.get(v + i);
                if (!(cellInStruct instanceof PointerToHeapCell)) {
                    throw new Error("Heap Cell in Struct is not os type PointerToHeapCell!");
                }
                if (!this.check(state, u,  this.deref(state, cellInStruct.value))) {
                    return false;
                }
            }
        }

        return true;
    }

    public static deref(state: State, v: number): number {
        const other: Cell = state.heap.get(v)!;

        if (other instanceof VariableCell && other.value != v) {
            return this.deref(state, other.value);
        } else {
            return v;
        }
    }
}
