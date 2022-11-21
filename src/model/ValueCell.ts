import {Cell} from "./Cell";

export type ValueCellTag = "HP" | "TP" | "PC";

export class ValueCell extends Cell {

    constructor(
        readonly value: number,
        readonly tag?: ValueCellTag,
    ) {
        super();
    }
}

