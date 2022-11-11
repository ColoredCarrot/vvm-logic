import {Cell} from "./Cell";

export class ValueCell extends Cell {
    value: number;

    constructor(value: number) {
        super();
        this.value = value;
    }

    getValue(): number {
        return this.value;
    }

}

