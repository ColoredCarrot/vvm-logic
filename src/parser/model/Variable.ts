export class Variable{

    name: string;
    kind: string = "Variable";
    initialized: boolean = false;

    constructor(name: string) {
        this.name = name;
    }
}