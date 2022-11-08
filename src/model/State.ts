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

    framePointer = 0;
    backtrackPointer = 0;
    trailPointer = 0;
    programCounter = 0;
    // stackPointer = stack.length
}
