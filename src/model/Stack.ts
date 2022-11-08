import {Cell} from "./Cell";

export class Stack {

    private values: Cell[] = [];

    push(value: Cell): void {
        this.values.push(value);
    }

    pop(): Cell {
        return this.values.pop()!;
    }

    get(index: number): Cell {
        return this.values[index]!;
    }

    set(index: number, value: Cell): void {
        this.values[index] = value;
    }

    get size(): number {
        return this.values.length;
    }
}
