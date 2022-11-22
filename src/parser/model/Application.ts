import {Term} from "./Term";

export class Application{

    //FIXMEL:
    name: string; // f/n
    terms: Term[];
    kind: string = "Application";

    constructor(name: string, terms: Term[]) {
        this.name = name;
        this.terms = terms;

    }
}