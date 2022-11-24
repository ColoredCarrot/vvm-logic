import {Program} from "./model/Program";

export abstract class Parsing {

    //eslint-disable-next-line @typescript-eslint/no-var-requires
    private static parser = require("./prol").parser;

    public static parse(value: string): Program {
        return this.parser.parse(value);
    }
}
