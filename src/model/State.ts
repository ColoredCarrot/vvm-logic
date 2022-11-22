import {Heap} from "./Heap";
import {Stack} from "./Stack";
import {GarbageCollector} from "./GarbageCollector";
import {Trail} from "./Trail";
import {Cell} from "./Cell";
import {TryChain} from "./TryChain";
import {Dialog} from "./dialog/Dialog";

interface StateVars {
    readonly heap: Heap;
    readonly stack: Stack;
    readonly trail: Trail;
    readonly garbageCollector: GarbageCollector;
    readonly tryChain: TryChain;
    readonly framePointer: number;
    readonly backtrackPointer: number;
    readonly programCounter: number;
    readonly activeDialog: Dialog<readonly string[]> | null;
}

/**
 * Encapsulates the entire state of the virtual machine.
 */
export class State implements StateVars {
    private constructor(private readonly vars: StateVars) {
    }

    static new(): State {
        return new State({
            heap: Heap.empty(),
            stack: Stack.empty(),
            trail: Trail.empty(),
            garbageCollector: new GarbageCollector(),
            tryChain: TryChain.empty(),
            framePointer: -1,
            backtrackPointer: -1,
            programCounter: -1,
            activeDialog: null,
        });
    }

    get heap(): Heap {
        return this.vars.heap;
    }

    setHeap(heap: Heap): State {
        return new State({...this.vars, heap: heap});
    }

    modifyHeap(f: (_: Heap) => Heap): State {
        return this.setHeap(f(this.heap));
    }

    get stack(): Stack {
        return this.vars.stack;
    }

    setStack(stack: Stack): State {
        return new State({...this.vars, stack: stack});
    }

    setStackAt(index: number, value: Cell): State {
        return this.setStack(this.stack.set(index, value));
    }

    pushStack(cell: Cell): State {
        const newStack: Stack = this.stack.push(cell);
        return this.setStack(newStack);
    }

    /**
     * Enables this class to be used in a fluent interface (see example below).
     *
     * @example
     * // Correct usage
     * return state
     *     .modifyStack(s => s.push(x))
     *     .modifyStack(s => s.push(y))
     *
     * // Incorrect usage
     * return state
     *     .setStack(state.stack.push(x))
     *     .setStack(state.stack.push(y))
     */
    modifyStack(f: (_: Stack) => Stack): State {
        return this.setStack(f(this.stack));
    }

    get trail(): Trail {
        return this.vars.trail;
    }

    setTrail(trail: Trail): State {
        return new State({...this.vars, trail: trail});
    }

    modifyTrail(f: (_: Trail) => Trail): State {
        return this.setTrail(f(this.trail));
    }

    get garbageCollector(): GarbageCollector {
        return this.vars.garbageCollector;
    }

    get tryChain(): TryChain {
        return this.vars.tryChain;
    }

    setTryChain(tryChain: TryChain): State {
        return new State({...this.vars, tryChain: tryChain});
    }

    modifyTryChain(f: (_: TryChain) => TryChain): State {
        return this.setTryChain(f(this.tryChain));
    }

    get framePointer(): number {
        return this.vars.framePointer;
    }

    setFramePointer(fp: number): State {
        return new State({...this.vars, framePointer: fp});
    }

    get backtrackPointer(): number {
        return this.vars.backtrackPointer;
    }

    setBacktrackPointer(bp: number): State {
        return new State({...this.vars, backtrackPointer: bp});
    }

    get programCounter(): number {
        return this.vars.programCounter;
    }

    setProgramCounter(pc: number): State {
        return new State({...this.vars, programCounter: pc});
    }

    get activeDialog(): Dialog<readonly string[]> | null {
        return this.vars.activeDialog;
    }

    setActiveDialog(dialog: Dialog<readonly string[]> | null): State {
        return new State({...this.vars, activeDialog: dialog});
    }

    modify(f: (_: State) => State): State {
        return f(this);
    }

    equals(that: State): boolean {
        return this === that || JSON.stringify(this) === JSON.stringify(that);
    }
}
