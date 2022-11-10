import {InstructionParser} from "../exec/InstructionParser";

const page140Example: string [] =
        ["init N",
            "pushenv 0",
            "mark A",
            "call p/0",
            "A: halt 0",
            "N: no",
            "t/1: pushenv 1",
            "putref 1",
            "uatom b",
            "popenv",
            "p/0: pushenv 1",
            "mark B",
            "putvar 1",
            "call q/1",
            "B: mark C",
            "putref 1",
            "call t/1",
            "C: popenv",
            "q/1: pushenv 1",
            "mark D",
            "putref 1",
            "call s/1",
            "D: popenv",
            "s/1: setbtp",
            "try E",
            "delbtp",
            "jump F",
            "E: pushenv 1",
            "mark G",
            "putref 1",
            "call t/1",
            "G: popenv",
            "F: pushenv 1",
            "putref 1",
            "uatom a",
            "popenv"];

test("page 140 example no check", () => {
    const result = InstructionParser.parseInput(page140Example);
    const instructions = result.at(0)!;
    const labels = result.at(1)!;

    console.log("Parsing finished");
    console.log(labels);
    console.log(instructions);
});

