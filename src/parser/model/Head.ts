import {Variable} from "./Variable";

export class Head{

    name: string;
    variables: Variable[];

    constructor(name: string, variables: Variable[]) {
        this.name = name;
        this.variables = variables;
    }
}
