import {InstructionParser, ParseError} from "../exec/InstructionParser";
import {SignLabel} from "../exec/SignLabel";
import {Call} from "../exec/instructions/Call";
import {InvalidInstruction} from "../exec/instructions/InvalidInstruction";
import {Pop} from "../exec/instructions/Pop";
import {Pushenv} from "../exec/instructions/Pushenv";

test("parse pop", () => {
    const instr = InstructionParser.parseInstruction("POP", []);
    expect(instr).toBeInstanceOf(Pop);
});

test("parse call", () => {
    const instr = InstructionParser.parseInstruction("CALL f/4", [new SignLabel(2, "f/4")]);
    expect(instr).toBeInstanceOf(Call);

    const call = instr as Call;
    expect(call.sign).toBe("f/4");
    expect(call.size).toBe(4);
    expect(call.labelLine).toBe(2);
});

test("invalid instruction", () => {
    const instr = InstructionParser.parseInstruction("UNKNOWN 1 2", []);
    expect(instr).toBeInstanceOf(InvalidInstruction);
});

test("missing label", () => {
    expect(
        () => InstructionParser.parseInstruction("CALL f/4", [new SignLabel(2, "f/5")])
    ).toThrow(ParseError);
});

test("parse pushenv", () => {
    const instr = InstructionParser.parseInstruction("PUSHENV 0", []);
    expect(instr).toBeInstanceOf(Pushenv);

    const pushenv = instr as Pushenv;
    expect(pushenv.mVar).toStrictEqual(0);
});

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

    //console.log("Parsing finished");
    //console.log(labels);
    //console.log(instructions);
});
