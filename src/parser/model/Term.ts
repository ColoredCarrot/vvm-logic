import {Atom} from "./Atom";
import {Anon} from "./Anon";
import {Variable} from "./Variable";
import {Application} from "./Application";

export class Term{

    value: Atom | Anon | Variable | Application;
    //kind: string;

    constructor(value: Atom | Anon | Variable | Application) {
        this.value = value;
    }

}