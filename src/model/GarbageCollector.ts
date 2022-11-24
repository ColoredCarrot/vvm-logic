import {State} from "./State";
import {Cell} from "./Cell";
import {VariableCell} from "./VariableCell";
import {StructCell} from "./StructCell";
import {PointerToHeapCell} from "./PointerToHeapCell";

export class GarbageCollector {
    private static readonly GC_ENABLED = false;
    
    
    run(state: State): State {
        if (!GarbageCollector.GC_ENABLED)
            return state;
        
        //Find Reachable Heap Elements
        const reachable: Set<number> = new Set<number>();
        for (const s of state.stack.toArray()) {
            if (s instanceof PointerToHeapCell) {
                GarbageCollector.findReachableRecursive(state, reachable, s.value);
            }
        }

        //Delete not reachable Elements
        const toBeRemoved: number[] = [];
        for (const a of state.heap.getKeySet()) {
            if (!reachable.has(a)) {
                toBeRemoved.push(a);
            }
        }

        return state.modifyHeap(h => h.dealloc(toBeRemoved));
    }

    private static findReachableRecursive(state: State, visited: Set<number>, current: number): void {
        if (!visited.has(current)) {
            visited.add(current);
            const currentCell: Cell = state.heap.get(current);
            if (currentCell instanceof VariableCell) {
                return this.findReachableRecursive(state, visited, currentCell.value);
            }
            if (currentCell instanceof StructCell) {
                for (let i = current + 1; i < current + 1 + currentCell.size; i++) {
                    this.findReachableRecursive(state, visited, i);
                }
            }
        }
    }
}
