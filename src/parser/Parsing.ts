import {Program} from "./model/Program";

export abstract class Parsing {
    private static parser = require("./prol").parser;

    public static parse(value: string) : Program {
        return this.parser.parse(value);
    }
}