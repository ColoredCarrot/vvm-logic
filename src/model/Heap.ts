import {Cell} from "./Cell";
import Immutable from "immutable";


type Address = number;

/**
 * Immutable data structure that represents a logical virtual machine's heap.
 *
 * Invariants:
 * - Cells that point to another cell always point to cells with a smaller or equal address as itself.
 */
export class Heap {

    private constructor(
        private readonly data: Immutable.Map<Address, Cell>,
        private readonly _heapPointer: Address,
    ) {
    }

    getHeapPointer(): Address {
        return this._heapPointer;
    }

    setHeapPointer(newHeapPointer: Address): Heap {
        return new Heap(this.data, newHeapPointer);
    }

    static empty(): Heap {
        return new Heap(Immutable.Map(), 100);
    }

    static of(heapPointer: Address, ...elems: [Address, Cell][]): Heap {
        return new Heap(Immutable.Map(elems), heapPointer);
    }

    get(address: Address): Cell {
        return this.data.get(address)!;
    }

    set(address: Address, value: Cell): Heap {
        return new Heap(this.data.set(address, value), this._heapPointer);
    }

    /**
     * Allocates the given cells contiguously on the heap.
     *
     * @return Tuple of updated Heap and address of first cell.
     */
    alloc(cells: Cell[]): [Heap, Address] {
        const addr = this._heapPointer;

        // Populate heap starting at address
        let newData = this.data;
        for (let i = 0; i < cells.length; ++i) {
            newData = newData.set(addr + i, cells[i]);
        }

        return [
            new Heap(newData, this._heapPointer + cells.length),
            addr,
        ];
    }

    equals(that: Heap): boolean {
        if (this.data.size !== that.data.size) {
            return false;
        }

        // Check contents
        for (const [addr, cell] of this.data) {
            if (that.data.get(addr)?.equals(cell) !== true) {
                return false;
            }
        }

        return this._heapPointer === that._heapPointer;
    }
}
