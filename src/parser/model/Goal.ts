import {Literal} from "./Literal";
import {Unification} from "./Unification";

export class Goal {

    value: Literal | Unification;

    constructor(value: Literal | Unification) {
        this.value = value;
    }
}