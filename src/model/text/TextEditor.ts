export type Caret = { readonly row: number, readonly col: number };

export enum MovementMode {
    One,
    Word,
    Line,
}

/**
 * Headless, immutable text editor that supports multiple carets.
 */
export class TextEditor {

    /**
     * @param lines Sanitized lines
     * @param carets List of carets sorted such that the carets that come last in the document are first in the array
     * @param primaryCaretIdx Index of primary caret in {@link carets}
     */
    private constructor(
        readonly lines: readonly string[],
        readonly carets: readonly Caret[],
        readonly primaryCaretIdx: number,
    ) {
    }

    static create(): TextEditor {
        return new TextEditor([""], [{row: 0, col: 0}], 0);
    }

    static forText(text: string): TextEditor {
        return this.create().insert(text).setCaret();
    }

    get text(): string {
        return this.lines.join("\n");
    }

    setCaret(...caret: readonly Caret[]): TextEditor {
        const carets = caret.length === 0 ? [{row: 0, col: 0}] : caret.slice();
        carets.sort(compareCaretsDesc);
        removeDuplicateCarets(carets);
        return new TextEditor(this.lines, carets, 0);
    }

    addCaret(caret: Caret): TextEditor {
        return this.setCaret(...this.carets, caret);
    }

    private setPrimaryCaret(idx: number): TextEditor {
        return new TextEditor(this.lines, this.carets, idx);
    }
    
    moveTo(direction: "home" | "end"): TextEditor {
        const carets = this.carets.map(({row}) => {
            switch (direction) {
            case "home":
                return {row: row, col: 0};
            case "end":
                return {row: row, col: this.lines[row].length};
            }
        });
        return new TextEditor(this.lines, carets, this.primaryCaretIdx);
    }

    move(direction: "left" | "right" | "up" | "down", mode: MovementMode = MovementMode.One): TextEditor {
        const carets = this.carets.map(({row, col}) => {
            switch (direction) {
            case "left": {
                if (col === 0) {
                    return row === 0
                        ? {row, col}
                        : {row: row - 1, col: this.lines[row - 1].length};
                }
                const n = TextEditor.measureLeftward(mode, col, this.lines[row]);
                return {row, col: col - n};
            }
            case "right": {
                if (col === this.lines[row].length) {
                    return row === this.lines.length - 1
                        ? {row, col}
                        : {row: row + 1, col: 0};
                }
                const n = TextEditor.measureRightward(mode, col, this.lines[row]);
                return {row, col: col + n};
            }
            case "up": {
                return row === 0
                    ? {row, col: 0}
                    : {row: row - 1, col: Math.min(col, this.lines[row - 1].length)};
            }
            case "down": {
                return row === this.lines.length - 1
                    ? {row, col: this.lines[this.lines.length - 1].length}
                    : {row: row + 1, col: Math.min(col, this.lines[row + 1].length)};
            }
            }
        });
        // Might lead to duplicates at the very beginning [resp. end], since moving at the ends is a no-op
        removeDuplicateCarets(carets);
        return new TextEditor(this.lines, carets, this.primaryCaretIdx);
    }

    insert(s: string): TextEditor {
        const linesToInsert = s.split("\n").map(TextEditor.sanitize);
        return this.insertUnsafe(linesToInsert);
    }

    backspace(mode = MovementMode.One): TextEditor {
        const lines = this.lines.slice();
        const carets = this.carets.slice();
        let primaryCaretIdx = this.primaryCaretIdx;

        for (let i = 0; i < carets.length; ++i) {
            const {row, col} = carets[i];
            const line = lines[row];

            if (col === 0) {
                // Delete newline; mode doesn't matter.
                if (row > 0) {  // Cannot delete first line
                    lines.splice(row, 1);
                    carets[i] = {row: row - 1, col: lines[row - 1].length};
                    lines[row - 1] += line;
                    // Move carets that were on the same line, e.g.:
                    //  foo     => backspace, first caret (last already processed) =>  foo|ba|r
                    //  |ba|r
                    for (let j = 0; j < i && carets[j].row === row; ++j) {
                        carets[j] = {row: row - 1, col: carets[j].col};
                    }
                }
            } else {
                // Delete from line. This cannot possibly add or remove lines.
                const numCharsToDelete = TextEditor.measureLeftward(mode, col, line);

                lines[row] = line.slice(0, col - numCharsToDelete) + line.slice(col);

                // Move our caret backward
                // This might create a duplicate caret (e.g. fo|o| -> backspace, last caret -> fo||)
                const newCol = col - numCharsToDelete;
                carets[i] = {row, col: newCol};
                let didSplice = false;
                if (i < carets.length - 1 && carets[i + 1].row === row && carets[i + 1].col === newCol) {
                    carets.splice(i, 1);
                    didSplice = true;
                    if (primaryCaretIdx > i) {
                        --primaryCaretIdx;
                    }
                }

                // Move backward the carets after us on the same line. This cannot create duplicates.
                for (let j = 0; j < i && carets[j].row === row; ++j) {
                    carets[j] = {row, col: carets[j].col - numCharsToDelete};
                }

                if (didSplice) {
                    --i;
                }
            }
        }

        return new TextEditor(lines, carets, primaryCaretIdx);
    }

    delete(mode = MovementMode.One): TextEditor {
        // Caret at very end of document requires special treatment
        if (this.isCaretAtEnd()) {
            // Delete at end of document is a no-op
            if (this.carets.length === 1) {
                return this;
            }

            const res = new TextEditor(this.lines, this.carets.slice(1), 0)
                .move("right", mode)
                .backspace(mode);

            // Resulting editor might have an additional (duplicate) caret at document end now,
            // in the case  "fo|o|" -> delete -> "fo||".
            // We removed the last caret for processing the delete, so we need to re-add it iff that wouldn't cause a duplicate.
            return res.isCaretAtEnd()
                ? res.setPrimaryCaret(Math.min(res.carets.length - 1, res.primaryCaretIdx))
                : res.addCaret({row: res.lines.length - 1, col: res.lines[res.lines.length - 1].length});
        }

        return this.move("right", mode).backspace(mode);
    }

    private static measureLeftward(mode: MovementMode, col: number, line: string): number {
        console.assert(col > 0);
        switch (mode) {
        case MovementMode.One:
            return 1;
        case MovementMode.Word: {
            const isWhitespace = line[col - 1] === " ";
            let n = 1;
            while (col - n - 1 >= 0 && (line[col - n - 1] === " ") === isWhitespace) {
                ++n;
            }
            return n;
        }
        case MovementMode.Line:
            return col;
        }
    }

    private static measureRightward(mode: MovementMode, col: number, line: string): number {
        console.assert(col < line.length);
        switch (mode) {
        case MovementMode.One:
            return 1;
        case MovementMode.Word: {
            const isWhitespace = line[col] === " ";
            let n = 1;
            while (col + n < line.length && (line[col + n] === " ") === isWhitespace) {
                ++n;
            }
            return n;
        }
        case MovementMode.Line:
            return line.length - col;
        }
    }

    private insertUnsafe(linesToInsert: readonly string[]): TextEditor {
        const firstLineToInsert = linesToInsert[0];
        const lastLineToInsert = linesToInsert[linesToInsert.length - 1];
        const middleLinesToInsert = linesToInsert.slice(1, -1);

        const lines = this.lines.slice();
        const carets = this.carets.slice();

        for (let i = 0; i < this.carets.length; ++i) {
            const {row, col} = this.carets[i];

            const line = lines[row];
            const beforeCaret = line.slice(0, col);
            const afterCaret = line.slice(col);

            let caretMovement: Caret;

            if (linesToInsert.length === 1) {
                lines[row] = beforeCaret + firstLineToInsert + afterCaret;
                caretMovement = {row: 0, col: firstLineToInsert.length};
            } else {
                const newLines = [beforeCaret + firstLineToInsert, ...middleLinesToInsert, lastLineToInsert + afterCaret];
                lines.splice(row, 1, ...newLines);
                caretMovement = {row: linesToInsert.length - 1, col: -col + lastLineToInsert.length};

                // Move carets after as downward by the amount of inserted newlines
                for (let j = 0; j < i; ++j) {
                    if (carets[j].row > row) {
                        carets[j] = {
                            row: carets[j].row + linesToInsert.length - 1,
                            col: carets[j].col,
                        };
                    }
                }
            }

            // Move those carets that were on the same line as us by the same movement
            for (let j = i; j >= 0 && carets[j].row === row; --j) {
                carets[j] = {row: row + caretMovement.row, col: carets[j].col + caretMovement.col};
            }
        }

        return new TextEditor(lines, carets, this.primaryCaretIdx);
    }

    private static sanitize(s: string): string {
        return s
            .replaceAll(/\t/g, "  ")
            .replaceAll(/[^a-z0-9_:/[\]| ]/ig, "");
    }

    private isCaretAtEnd({row, col}: Caret = this.carets[0]): boolean {
        return row === this.lines.length - 1 && col === this.lines[row].length;
    }
}

function compareCaretsDesc(a: Caret, b: Caret): number {
    const byRow = b.row - a.row;
    return byRow !== 0 ? byRow : b.col - a.col;
}

function removeDuplicateCarets(carets: Caret[]): void {
    for (let i = carets.length - 1; i >= 0; --i) {
        let isDup = false;
        for (let j = i + 1; j < carets.length; ++j) {
            if (compareCaretsDesc(carets[i], carets[j]) === 0) {
                isDup = true;
                break;
            }
        }
        if (isDup) {
            carets.splice(i, 1);
        }
    }
}
