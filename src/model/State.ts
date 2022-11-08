import {Heap} from "./Heap";
import {Stack} from "./Stack";
import {GarbageCollector} from "./GarbageCollector";

/**
 * Encapsulates the entire state of the virtual machine.
 */
export class State {
    heap: Heap = new Heap();
    stack: Stack = new Stack();
    garbageCollector: GarbageCollector = new GarbageCollector();

    stackPointer: number = 0
    framePointer: number = 0
    backtrackPointer: number = 0
    trailPointer: number = 0
    programCounter: number = 0
}
