import {Clause} from "./Clause";
import {Query} from "./Query";

export class Program {

    clauses: Clause[];
    query: Query;

    constructor(clauses: Clause[], query: Query) {
        this.clauses = clauses;
        this.query = query;

    }

}
