import {Cell} from "./Cell";
import {StackCell} from "./StackCell";

export class Pointer extends Cell implements StackCell {
    value : number;

    //value can be
    constructor(value: number) {
        super();
        this.value = value;
    }
}

