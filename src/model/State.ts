import {Heap} from "./Heap";
import {Stack} from "./Stack";
import {GarbageCollector} from "./GarbageCollector";

/**
 * Encapsulates the entire state of the virtual machine.
 */
export class State {

    constructor(
        public heap: Heap = Heap.empty(),
        public stack: Stack = new Stack(),
        public trail: number[] = [],
        public garbageCollector: GarbageCollector = new GarbageCollector(),
        public framePointer = -1,
        public backtrackPointer = -1,
        public trailPointer = -1,
        public programCounter = 0,
        // heapPointer = heap.newAllocAddress
        // stackPointer = stack.length
    ) {
    }

    setProgramCounter(pc: number): State {
        return new State(
            this.heap,
            this.stack,
            this.trail,
            this.garbageCollector,
            this.framePointer,
            this.backtrackPointer,
            this.trailPointer,
            pc,
        );
    }

    getFramePointer(): number {
        return this.framePointer;
    }

    setFramePointer(framePointer: number): void {
        this.framePointer = framePointer;
    }

    getBacktrackPointer(): number {
        return this.backtrackPointer;
    }

    setBacktrackPointer(backtrackPointer: number): void {
        this.backtrackPointer = backtrackPointer;
    }

    getTrailPointer(): number {
        return this.trail.length - 1;
    }

    setTrailPointer(trailPointer: number): void {
        while (trailPointer > this.getTrailPointer()) {
            this.trail.pop();
        }
    }

    getProgramCounter(): number {
        return this.programCounter;
    }

}
