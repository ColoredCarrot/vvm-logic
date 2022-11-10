import {Cell} from "./Cell";

export class ValueCell extends Cell {
    value: number;

    constructor(value: number) {
        super();
        this.value = value;
    }
}

