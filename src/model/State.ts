import {Heap} from "./Heap";
import {Stack} from "./Stack";
import {GarbageCollector} from "./GarbageCollector";

/**
 * Encapsulates the entire state of the virtual machine.
 */
export class State {
    heap: Heap = Heap.empty();
    stack: Stack = new Stack();
    trail : number[] = [];
    garbageCollector: GarbageCollector = new GarbageCollector();

    framePointer = -1;
    backtrackPointer = -1;
    programCounter = 0;
    heapPointer = 0;
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
        return this.trail.length - 1;
    }

    setTrailPointer(trailPointer: number): void{
        while (trailPointer > this.getTrailPointer()) {
            this.trail.pop();
        }
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
