export abstract class Cell {
    toString(): string {
        return this.constructor.name + JSON.stringify(this);
    }

    toJSON(): object {
        return {...this, "__type__": this.constructor.name};
    }
}
