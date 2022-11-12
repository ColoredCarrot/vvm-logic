/**
 * A non-empty, non-comment line in the program text.
 */
import {InstructionParser} from "../exec/InstructionParser";
import {Instruction} from "../exec/instructions/Instruction";

export class ProgramTextLine {
    constructor(
        readonly srcLine: number,
        /** Does not contain trailing comment, if any */
        readonly content: string,
        readonly instruction: Instruction,
    ) {
    }
}

/**
 * Encapsulates the raw and parsed program text at any given point of time.
 */
export class ProgramText {

    constructor(readonly raw: string, readonly codeLines: ProgramTextLine[]) {
    }

    get codeLineCount(): number {
        return this.codeLines.length;
    }

}

export function parseProgramText(raw: string): ProgramText {
    // TODO: Remove comments
    const codeLines = raw
        .split("\n")
        .map(line => line.trim().toLowerCase())
        .map((line, num) => [line, num] as const)
        .filter(([line]) => line.length > 0)
        .map(([line, num]) => new ProgramTextLine(num, line, InstructionParser.parseInstruction(line, [])))
    ;
    return new ProgramText(raw, codeLines);
}
