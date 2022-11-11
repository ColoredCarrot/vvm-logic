import {Cell} from "./Cell";

export class StructCell extends Cell {

    label: string; //TODO: the f of f/2 BAD Name for Attribute
    size: number;

    constructor(label: string, size: number) {
        super();   //Struct "header" does not have a value
        this.label = label;
        this.size = size;
    }
}
