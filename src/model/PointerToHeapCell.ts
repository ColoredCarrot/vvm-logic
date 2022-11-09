import {Cell} from "./Cell";

export class PointerToHeapCell extends Cell {
    value : number;

    //value can be
    constructor(value: number) {
        super();
        this.value = value;
    }
}
