import {Program} from "./model/Program";
import {PARSER} from "./prol";

export abstract class Parsing {

    //eslint-disable-next-line @typescript-eslint/no-var-requires
    // private static parser = require("./prol").parser;

    public static parse(value: string): Program {
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
        return PARSER.parse(value);
    }
}
