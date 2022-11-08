import {Cell} from "./Cell";

export class Struct extends Cell {
    size : number;
    label : string; //TODO: the f of f/2 BAD Name for Attribute

    constructor(label: string, size: number) {
        super();   //Struct "header" does not have a value
        this.size = size;
        this.label = label;
    }
}