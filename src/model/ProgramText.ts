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
        readonly codeLineNum: number,
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

/**
 * Encapsulates the raw and parsed program text at any given point of time.
 */
export class Text {
    constructor(
        readonly lines: readonly Line[],
    ) {
    }

    get rawLines(): string[] {
        return this.lines.map(l => l.raw);
    }

    get codeLineCount(): number {
        let res = 0;
        for (const line of this.lines) {
            if (line instanceof CodeLine) {
                ++res;
            }
        }
        return res;
    }

    getCodeLine(codeLineNum: number): CodeLine | null {
        return <CodeLine | null>(
            this.lines.find(l => l instanceof CodeLine && l.codeLineNum === codeLineNum)
            ?? null
        );
    }
}

export function parseProgramText(rawLines: readonly string[]): Text {
    // TODO: Handle comments

    const labels = InstructionParser.processLabels(rawLines);

    let codeLineNum = 0;

    return new Text(
        rawLines
            .map(line => line.trim().toLowerCase())
            .map((line, num) =>
                line.endsWith(":")
                    ? new LabelLine(num, line, rawLines[num])
                    : (line.length > 0
                        ? new CodeLine(num, line, rawLines[num], codeLineNum++, InstructionParser.parseInstruction(line, labels))
                        : new Line(num, line, rawLines[num])),
            ),
    );
}
