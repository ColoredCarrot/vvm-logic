import {Variable} from "./Variable";
import {Term} from "./Term";

export class Unification {

    variable: Variable;
    term: Term;
    kind = "Unification";

    constructor(variable: Variable, term: Term) {
        this.variable = variable;
        this.term = term;
    }
}
