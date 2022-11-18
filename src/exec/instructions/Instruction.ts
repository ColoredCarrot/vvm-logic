import {State} from "../../model/State";
import {Cell} from "../../model/Cell";
import {VariableCell} from "../../model/VariableCell";
import {StructCell} from "../../model/StructCell";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {ValueCell} from "../../model/ValueCell";
import {PointerToStackCell} from "../../model/PointerToStackCell";
import {AtomCell} from "../../model/AtomCell";
import {IllegalOperationError} from "../ExecutionError";

export abstract class Instruction {
    protected constructor(public instruction: string) {}

    abstract step(state: State): State;


    public static unify(state: State, u: number, v: number): [State, boolean] {
        if (u === v) {
            return [state, true];
        }
        const heapAtU: Cell = state.heap.get(u);
        const heapAtV: Cell = state.heap.get(v);
        if (heapAtU instanceof VariableCell) {
            if (heapAtV instanceof VariableCell) {
                if (u > v) {
                    state = state.setHeap(state.heap.set(u, new VariableCell(v)));
                    state = this.trail(state, u);
                    return [state, true];
                } else {
                    state = state.setHeap(state.heap.set(v, new VariableCell(u)));
                    state = this.trail(state, v);
                    return [state, true];
                }
            } else if (this.check(state, u, v)) {
                state = state.setHeap(state.heap.set(v, new VariableCell(u)));
                state = this.trail(state, u);
                return [state, true];
            } else {
                state = this.backtrack(state);
                return [state, false];
            }
        }
        if (heapAtV instanceof VariableCell) {
            if (this.check(state, v, u)) {
                state = state.setHeap(state.heap.set(v, new VariableCell(u)));
                state = this.trail(state, v);
                return [state, true];
            } else {
                state = this.backtrack(state);
                return [state, false];
            }
        }
        if (heapAtV instanceof AtomCell && heapAtU instanceof AtomCell
            && heapAtU.value === heapAtV.value) {
            return [state, true];
        }
        if (heapAtU instanceof StructCell && heapAtV instanceof StructCell
            && heapAtV.label === heapAtU.label) {
            const n = heapAtU.size;
            for (let i = 1; i <= n; i++) {
                const heapAtUpI = (<PointerToHeapCell>state.heap.get(u + i)).value;
                const heapAtVpI = (<PointerToHeapCell>state.heap.get(v + i)).value;

                const [newState, result] = this.unify(state, this.deref(state, heapAtUpI), this.deref(state, heapAtVpI));
                state = newState;
                if (!result) {
                    return [state, false];
                }
            }
            return [state, true];
        }

        state = this.backtrack(state);

        return [state, false];
    }

    public static backtrack(state: State): State {
        //Reset Frame Pointer
        state = state.setFramePointer(state.backtrackPointer);

        //Reset Heap Pointer
        const oldHeapPointer = state.stack.get(state.framePointer - 2);
        if (!(oldHeapPointer instanceof ValueCell)) {
            throw new IllegalOperationError("Expected ValueCell");
        }
        state = state.setHeap(state.heap.setHeapPointer(oldHeapPointer.value));

        //Reset Trail Pointer and reset()
        const oldTrailPointer = <ValueCell> state.stack.get(state.framePointer - 3);
        state = this.reset(state, oldTrailPointer.value, state.trail.trailPointer);

        state = state.setTrail(state.trail.setTrailPointer(oldTrailPointer.value));

        //Set PC to negative Continuation address
        const negativeCont = <PointerToStackCell>state.stack.get(state.framePointer - 5);
        state = state.setProgramCounter(negativeCont.value);

        return state;
    }
    public static trail(state: State, u: number): State {
        const onStack = state.stack.get(state.backtrackPointer - 2);
        if (!(onStack instanceof ValueCell)) {
            throw new IllegalOperationError("Expected Heap Pointer on Stack to be Type ValueCell!");
        } else {
            if (u < onStack.value) {
                return state.setTrail(state.trail.push(u));
            } else {
                return state;
            }
        }
    }

    /**
     * Reset Objects on Heap to unbound variable
     * @param state - state of wim
     * @param x - reset variables on heap addresses [y:x]
     * @param y -
     */
    public static reset(state: State, x: number, y: number): State {
        let heap = state.heap;
        for (let u = y; x < u; u--) {
            const resetCell: number = state.trail.get(u)!;
            const resetTo: Cell = new VariableCell(resetCell);

            heap = heap.set(resetCell, resetTo);
        }
        return state.setHeap(heap);
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
