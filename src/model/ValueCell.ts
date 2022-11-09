import {Cell} from "./Cell";

export class ValueCell extends Cell {
    value: number | undefined;

    constructor(value: number | undefined) {
        super();

        if (value) {
            this.value = value;
        } else {
            this.value = undefined;
        }
    }
}

