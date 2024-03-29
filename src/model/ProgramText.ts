import {InstructionParser} from "../exec/InstructionParser";
import {Instruction} from "../exec/instructions/Instruction";

export class Line {
    constructor(
        readonly num: number,
        /** Trimmed and excluding any trailing comment */
        readonly content: string,
        readonly raw: string,
    ) {
    }
}

export class CodeLine extends Line {
    constructor(
        num: number,
        content: string,
        raw: string,
        readonly instruction: Instruction,
    ) {
        super(num, content, raw);
    }
}

export class LabelLine extends Line {
    constructor(
        num: number,
        content: string,
        raw: string,
    ) {
        super(num, content, raw);
    }
}

export class CompositionLine extends CodeLine {
    constructor(
        num: number,
        content: string,
        raw: string,
        instruction: Instruction,
    ) {
        super(num, content, raw, instruction);
    }
}

/**
 * Encapsulates the raw and parsed program text at any given point of time.
 */
export class Text {
    constructor(
        readonly lines: readonly Line[],
    ) {
        for (let i = 0; i < lines.length; ++i) {
            if (lines[i].num !== i) {
                throw new Error("Line numbers are wrong");
            }
        }
    }

    get rawLines(): string[] {
        return this.lines.map(l => l.raw);
    }

    get codeLineCount(): number {
        let res = 0;
        for (const line of this.lines) {
            if (line instanceof CodeLine || line instanceof CompositionLine) {
                ++res;
            }
        }
        return res;
    }

    getCodeLine(num: number): CodeLine | null {
        return (
            this.lines.find(l => (l instanceof CodeLine || l instanceof CompositionLine) && l.num === num)
            ?? null
        ) as CodeLine | null;
    }

    getNextCodeLine(programCounter: number): CodeLine | null {
        let numToExec = programCounter;
        while (numToExec < this.lines.length && this.getCodeLine(numToExec) === null) {
            ++numToExec;
        }

        return this.getCodeLine(numToExec);
    }
}

export function parseProgramText(rawLines: readonly string[]): Text {
    // TODO: Handle comments

    const labels = InstructionParser.processLabels(rawLines);

    return new Text(
        rawLines
            .map(line => line.trim().toLowerCase())
            .map((line, num) => {
                if (labels.find(v => v.line == num)) {
                    if (line.endsWith(":")) { //Nothing after Label, just Label
                        return new LabelLine(num, line, rawLines[num]);
                    } else { //Something after Label, try to parse as Instruction
                        return new CompositionLine(num, line, rawLines[num], InstructionParser.parseInstruction(line, labels));
                    }
                } else {
                    //Instruction
                    return new CodeLine(num, line, rawLines[num], InstructionParser.parseInstruction(line, labels));
                }
            }),
    );
}
