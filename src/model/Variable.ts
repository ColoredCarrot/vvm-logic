import {Cell} from "./Cell";

export class Variable extends Cell {
    readonly tag : string;
    value : number;


    constructor(value: number) {
        super();
        this.value = value;
        this.tag = "R";
    }
}