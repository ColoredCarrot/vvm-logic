export abstract class Cell {

    equals(that: Cell): boolean {
        return JSON.stringify(this) === JSON.stringify(that);
    }

    toString(): string {
        return "Cell" + JSON.stringify(this);
    }
}
