import {Cell} from "./Cell";

export class PointerToStackCell extends Cell{
    value : number;

    constructor(value: number) {
        super();
        this.value = value;
    }
}