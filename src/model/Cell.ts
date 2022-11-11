export abstract class Cell {
    toString(): string {
        return this.constructor.name + JSON.stringify(this);
    }
}
