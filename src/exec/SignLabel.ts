import {Label} from "./Label";

export class SignLabel extends Label {
    private _size: number;

    constructor(line: number, text: string) {
        super(line, text);
        this._size = Number(text.split("/").at(1)!);
    }


    get size(): number {
        return this._size;
    }
}
