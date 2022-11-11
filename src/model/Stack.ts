import {Cell} from "./Cell";
import Immutable from "immutable";
import {IllegalOperationError} from "../exec/ExecutionError";

export class Stack {

    private constructor(
        private readonly values: Immutable.List<Cell>,
    ) {
    }

    static empty(): Stack {
        return new Stack(Immutable.List());
    }

    static of(...elems: Cell[]): Stack {
        return new Stack(Immutable.List(elems));
    }

    push(value: Cell): Stack {
        return new Stack(this.values.push(value));
    }

    pop(n = 1): Stack {
        if (n < 0) {
            throw new IllegalOperationError("Attempting to pop negative amount from stack");
        }
        if (this.values.size < n) {
            throw new IllegalOperationError("Attempting to pop insufficiently large Stack");
        }

        return new Stack(this.values.slice(0, -n));
    }

    get(index: number): Cell {
        return this.values.get(index)!;
    }

    set(index: number, value: Cell): Stack {
        if (index < 0 || index >= this.values.size) {
            throw new IllegalOperationError("Attempting to set Stack value at illegal index " + index + " to " + value);
        }

        return new Stack(this.values.set(index, value));
    }

    get size(): number {
        return this.values.size;
    }

    get stackPointer(): number {
        return this.size - 1;
    }

    equals(that: Stack): boolean {
        if (this.size !== that.size) {
            return false;
        }

        for (let idx = 0; idx < this.size; ++idx) {
            const thisCell = this.values.get(idx)!;
            const thatCell = that.values.get(idx)!;
            if (!thisCell.equals(thatCell)) {
                return false;
            }
        }

        return true;
    }
}
