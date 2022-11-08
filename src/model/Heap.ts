export class Heap {


    data: Map<number, Value>;

    constructor() {
        this.data = new Map<number, Value>();
    }

    set(address: number, value: Value ) {
        this.data.set(address, value);
    }

    // alloc(count: number): number {
    //     let address = this.nextAllocAddress;
    //
    //     this.data.set(address, []);
    //     this.nextAllocAddress += count;
    //
    //     return address;
    // }
}

type Value = string | number
