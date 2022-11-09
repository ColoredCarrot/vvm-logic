import {Cell} from "./Cell";

export class Pointer extends Cell {
    value : number;

    //value can be
    constructor(value: number) {
        super();
        this.value = value;
    }
}
