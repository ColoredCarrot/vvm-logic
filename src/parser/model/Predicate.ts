import {Clause} from "./Clause";

export class Predicate {

    name: string;
    param: number;
    clauses: Clause[];


    constructor(name: string, param: number, clauses: Clause[]) {
        this.name = name;
        this.param = param;
        this.clauses = clauses;
    }
}
