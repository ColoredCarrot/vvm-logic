import {Cell} from "./Cell";

export class VariableCell extends Cell {
    readonly tag: string;
    value: number;


    constructor(value: number) {
        super();
        this.value = value;
        this.tag = "R";
    }
}
