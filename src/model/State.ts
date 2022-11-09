import {Heap} from "./Heap";
import {Stack} from "./Stack";
import {GarbageCollector} from "./GarbageCollector";

/**
 * Encapsulates the entire state of the virtual machine.
 */
export class State {
    heap: Heap = Heap.empty();
    stack: Stack = new Stack();
    trail : Stack = new Stack();
    garbageCollector: GarbageCollector = new GarbageCollector();

    framePointer = 0;
    backtrackPointer = 0;
    trailPointer = 0;
    programCounter = 0;
    // stackPointer = stack.length

    getFramePointer(): number {
        return this.framePointer;
    }

    setFramePointer(framePointer: number){
        this.framePointer = framePointer;
    }

    getBacktrackPointer(): number{
        return this.backtrackPointer;
    }

    setBacktrackPointer(backtrackPointer: number): void{
        this.backtrackPointer = backtrackPointer;
    }

    getTrailPointer(): number{
        return this.trailPointer;
    }

    setTrailPointer(trailPointer: number): void{
        this.trailPointer = trailPointer;
    }

    getHeapPointer(): number{
        return this.heapPointer;
    }

    setHeapPointer(heapPointer: number): void{
        this.heapPointer = heapPointer;
    }

    getProgramCounter(): number{
        return this.programCounter;
    }

    setProgramCounter(programCounter: number){
        this.programCounter = programCounter;
    }


}
