import {Cell} from "./Cell";

export class AtomCell extends Cell {
    value : string;

    constructor(value: string) {
        super();
        this.value = value;
    }
}
