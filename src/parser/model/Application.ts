import {Term} from "./Term";

export class Application{

    name: string;
    terms: Term[];

    constructor(name: string, terms: Term[]) {
        this.name = name;
        this.terms = terms;

    }
}