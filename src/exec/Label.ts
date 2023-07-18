export class Label {
    private readonly _line: number;
    private readonly _text: string;

    constructor(line: number, text: string) {
        this._line = line;
        this._text = text.toLowerCase();
    }


    get line(): number {
        return this._line;
    }

    get text(): string {
        return this._text;
    }

    toString(): string {
        return this.text;
    }
}
