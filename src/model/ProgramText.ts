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

    constructor(
        readonly rawLines: readonly string[],
        readonly codeLines: readonly ProgramTextLine[],
    ) {
    }

    get codeLineCount(): number {
        return this.codeLines.length;
    }

    getCodeLineAtLine(lineNum: number): ProgramTextLine | null {
        return this.codeLines.find(codeLine => codeLine.srcLine === lineNum) ?? null;
    }

}

export function parseProgramText(rawLines: readonly string[]): ProgramText {
    // TODO: Remove comments
    const codeLines = rawLines
        .map(line => line.trim().toLowerCase())
        .map((line, num) => [line, num] as const)
        .filter(([line]) => line.length > 0)
        .map(([line, num]) => new ProgramTextLine(num, line, InstructionParser.parseInstruction(line, [])))
    ;
    return new ProgramText(rawLines, codeLines);
}
