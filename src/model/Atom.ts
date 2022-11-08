import {Cell} from "./Cell";

export class Atom extends Cell {
    value : string;


    constructor(value: string) {
        super();
        this.value = value;
    }
}