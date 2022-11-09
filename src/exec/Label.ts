export class Label {
    private _line : number
    private _text : string

    constructor(line: number, text: string) {
        this._line = line;
        this._text = text;
    }


    get line(): number {
        return this._line;
    }

    get text(): string {
        return this._text;
    }
}