export class Atom {

    value: string | number;
    kind: string = "Atom";

    constructor(value: number | string) {
        this.value = value;
    }


}