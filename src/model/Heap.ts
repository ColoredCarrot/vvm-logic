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
        private readonly nextAllocAddress: Address,
    ) {
    }

    static empty(): Heap {
        return new Heap(Immutable.Map(), 100);
    }

    get(address: Address): Cell {
        return this.data.get(address)!;
    }

    set(address: Address, value: Cell): Heap {
        return new Heap(this.data.set(address, value), this.nextAllocAddress);
    }

    /**
     * Allocates the given cells contiguously on the heap.
     *
     * @return Tuple of updated Heap and address of first cell.
     */
    alloc(cells: Cell[]): [Heap, Address] {
        const addr = this.nextAllocAddress;

        // Populate heap starting at address
        let newData = this.data;
        for (let i = 0; i < cells.length; ++i) {
            newData = newData.set(addr + i, cells[i]);
        }

        return [
            new Heap(newData, this.nextAllocAddress + cells.length),
            addr
        ];
    }
}
