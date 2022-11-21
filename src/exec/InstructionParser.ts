import {Bind} from "./instructions/Bind";
import {Call} from "./instructions/Call";
import {Check} from "./instructions/Check";
import {Delbtp} from "./instructions/Delbtp";
import {Fail} from "./instructions/Fail";
import {Init} from "./instructions/Init";
import {Instruction} from "./instructions/Instruction";
import {InvalidInstruction} from "./instructions/InvalidInstruction";
import {Jump} from "./instructions/Jump";
import {Lastcall} from "./instructions/Lastcall";
import {Lastmark} from "./instructions/Lastmark";
import {Mark} from "./instructions/Mark";
import {No} from "./instructions/No";
import {Pop} from "./instructions/Pop";
import {Popenv} from "./instructions/Popenv";
import {Prune} from "./instructions/Prune";
import {Pushenv} from "./instructions/Pushenv";
import {Putanon} from "./instructions/Putanon";
import {Putatom} from "./instructions/Putatom";
import {Putref} from "./instructions/Putref";
import {Putstruct} from "./instructions/Putstruct";
import {Putvar} from "./instructions/Putvar";
import {Slide} from "./instructions/Slide";
import {Son} from "./instructions/Son";
import {Uatom} from "./instructions/Uatom";
import {Unify} from "./instructions/Unify";
import {Up} from "./instructions/Up";
import {Uref} from "./instructions/Uref";
import {Ustruct} from "./instructions/Ustruct";
import {Uvar} from "./instructions/Uvar";
import {Label} from "./Label";
import {SignLabel} from "./SignLabel";
import {Setbtp} from "./instructions/Setbtp";
import {Try} from "./instructions/Try";
import {Trim} from "./instructions/Trim";
import {Setcut} from "./instructions/Setcut";
import {Index} from "./instructions/Index";
import {Getnode} from "./instructions/Getnode";
import {Entry} from "./instructions/Entry";
import {Halt} from "./instructions/Halt";

export class ParseError extends Error {
}

export class InstructionParser {

    static parseInput(inputLines: readonly string[]): [Instruction[], Label[]] {
        const labels: Label[]
            = this.processLabels(inputLines);

        const instructions: Instruction[]
            = this.parseInstructions(inputLines, labels);

        return [instructions, labels];
    }

    private static parseInstructions(input: readonly string[], labels: readonly Label[]): Instruction[] {
        const instrStrings: string[] = input.map(value => {
            return value.trim()
                .replace("/  +/g", " ")
                .toLowerCase();
        });

        const instructions: Instruction[] = [];
        for (const value of instrStrings) {
            instructions.push(this.parseInstruction(value, labels));
        }

        return instructions;
    }

    static parseInstruction(input: string, labels: readonly Label[]): Instruction {
        input = input.toLowerCase();
        //Has Label in front?
        const labelSplit = input.split(":");
        if (labelSplit.length == 2) {
            input = labelSplit[1].trim();
        } else if (labelSplit.length > 2) {
            return new InvalidInstruction(input);
        }

        const inputSplit: string[] = input.split(" ");
        const instr: string = inputSplit.at(0)!;

        const params: string[] = inputSplit.slice(1);

        if (params.length == 0) {
            return this.parseNoParamInstruction(instr);
        } else if (params.length == 1) {
            return this.parse1param(labels, instr, params.pop()!);
        } else if (params.length == 2) {
            return this.parse2params(labels, instr, params[0], params[1]);
        } else if (params.length == 3) {
            return this.parse3params(labels, instr, params[0], params[1], params[2]);
        }

        return new InvalidInstruction(input);
    }

    static processLabels(inputLines: readonly string[]): Label[] {
        const labels: Label[] = [];

        for (let i = 0; i < inputLines.length; i++) {
            const line = inputLines.at(i)!;
            const lblSplit = line.split(":");
            if (lblSplit.length > 2) {
                //TODO: Error?
            } else if (lblSplit.length > 1) {
                const lblString = lblSplit.at(0)!;
                //Line has a label
                let l: Label;
                if (this.isValidSignLabel(lblString)) {
                    l = new SignLabel(i, lblString);
                } else if (this.isValidLabel(lblString)) {
                    l = new Label(i, lblString);
                } else {
                    //TODO: Error
                    l = new Label(-1, "ERROR");
                }

                labels.push(l);
                // inputLines[i] = lblSplit.at(1)!;
            } else {
                //Line has no label
            }
        }

        return labels;
    }

    private static parse1param(labels: readonly Label[], instr: string, p0: string): Instruction {
        let returnInstruction: Instruction = new InvalidInstruction(instr + " " + p0);
        if (this.isValidSignLabel(p0)) {
            const signLabel = labels.find(v => {
                return v.text === p0;
            });
            if (!signLabel) {
                //ERROR
                returnInstruction = new InvalidInstruction(instr + " " + p0);
            } else {
                returnInstruction = this.parseSignParamInstruction(instr, <SignLabel>signLabel);
            }
        }
        if (returnInstruction instanceof InvalidInstruction && this.isValidLabel(p0)) {
            const l1 = labels.find(v => {
                return v.text === p0;
            });
            if (l1) {
                returnInstruction = this.parseLabelParamInstruction(instr, l1);
            } else {
                returnInstruction = new InvalidInstruction(instr + " " + p0);
            }
        }
        if (returnInstruction instanceof InvalidInstruction && this.isValidNumber(p0)) {
            returnInstruction = this.parseNumberParamInstruction(instr, Number(p0));
        }
        if (returnInstruction instanceof InvalidInstruction && this.isValidAtomName(p0)) {
            returnInstruction = this.parseStringParamInstructor(instr, p0);
        }
        return returnInstruction;
    }

    private static parse2params(labels: readonly Label[], instr: string, p0: string, p1: string): Instruction {
        const input = instr + " " + p0 + " " + p1;
        let returnInstruction: Instruction = new InvalidInstruction(input);
        if (this.isValidSignLabel(p0) && this.isValidLabel(p1)) {
            const l0 = <SignLabel>labels.find(v => {
                return v.text === p0 && v instanceof SignLabel;
            });
            const l1 = labels.find(v => {
                return v.text === p1;
            });
            if (!l0 || !l1) {
                returnInstruction = new InvalidInstruction(input);
            } else {
                returnInstruction = this.parseSignAndLabelParamInstruction(instr, l0!, l1!);
            }
        }
        if (returnInstruction instanceof InvalidInstruction && this.isValidSignLabel(p0) && this.isValidNumber(p1)) {
            const l0 = <SignLabel>labels.find(v => {
                return v.text === p0 && v instanceof SignLabel;
            });
            if (!l0) {
                returnInstruction = new InvalidInstruction(input);
            } else {
                returnInstruction = this.parseSignAndNumberParamInstruction(instr, l0, Number(p1));
            }
        }
        if (returnInstruction instanceof InvalidInstruction && this.isValidNumber(p0) && this.isValidNumber(p1)) {
            returnInstruction = this.parseNumberNumberParamInstruction(instr, Number(p0), Number(p1));
        }
        return returnInstruction;
    }

    private static parse3params(labels: readonly Label[], instr: string, p0: string, p1: string, p2: string): Instruction {
        const input = instr + " " + p0 + " " + p1 + " " + p2;
        if (this.isValidSignLabel(p0) && this.isValidContext(p1) && this.isValidLabel(p2)) {
            const l0 = new SignLabel(-1, p0);
            const l2 = labels.find(v => v.text === p2);
            if (l2) {
                return this.parseSignStringLabelParamInstruction(instr, l0, p1, l2);
            } else {
                return new InvalidInstruction(input);
            }
        }
        return new InvalidInstruction(input);
    }

    //<editor-fold> parse different Parameter Methods
    private static parseNumberNumberParamInstruction(instr: string, p0: number, p1: number): Instruction {
        switch (instr) {
        case "slide":
            return new Slide(p0, p1);
        default:
            return new InvalidInstruction(instr + " " + p0 + " " + p1);
        }
    }

    private static parseLabelParamInstruction(instr: string, param: Label): Instruction {
        switch (instr) {
        case "init":
            return new Init(param);
        case "mark":
            return new Mark(param);
        case "try":
            return new Try(param);
        case "up":
            return new Up(param);
        case "jump":
            return new Jump(param);
        default:
            return new InvalidInstruction(instr + " " + param.text);
        }
    }

    private static parseStringParamInstructor(instr: string, param: string): Instruction {
        switch (instr) {
        case "putatom":
            return new Putatom(param);
        case "uatom":
            return new Uatom(param);
        default:
            return new InvalidInstruction(instr + " " + param);
        }
    }

    private static parseNumberParamInstruction(instr: string, param: number): Instruction {
        switch (instr) {
        case "halt":
            return new Halt(param);
        case "check":
            return new Check(param);
        case "pushenv":
            return new Pushenv(param);
        case "putref":
            return new Putref(param);
        case "putvar":
            return new Putvar(param);
        case "son":
            return new Son(param);
        case "trim":
            return new Trim(param);
        case "uref":
            return new Uref(param);
        case "uvar":
            return new Uvar(param);
        }
        return new InvalidInstruction(instr + param);
    }

    private static parseSignAndLabelParamInstruction(instr: string, sign: SignLabel, label: Label): Instruction {
        switch (instr) {
        case "ustruct":
            return new Ustruct(sign, label);
        default:
            return new InvalidInstruction(instr + " " + sign + " " + label);
        }
    }

    private static parseSignAndNumberParamInstruction(instr: string, sign: SignLabel, secondParam: number): Instruction {
        switch (instr) {
        case "lastcall":
            return new Lastcall(sign, secondParam);
        default:
            return new InvalidInstruction(instr + " " + sign + " " + secondParam);
        }
    }

    private static parseSignParamInstruction(instr: string, sign: SignLabel): Instruction {
        switch (instr) {
        case "call":
            return new Call(sign);
        case "index":
            return new Index(sign);
        case "jump":
            return new Jump(sign);
        case "putstruct":
            return new Putstruct(sign);
        default:
            return new InvalidInstruction(instr + " " + sign.text);
        }
    }

    private static parseNoParamInstruction(input: string): Instruction {
        switch (input) {
        case "bind":
            return new Bind();
        case "delbtp":
            return new Delbtp();
        case "fail":
            return new Fail();
        case "getnode":
            return new Getnode();
        case "lastmark":
            return new Lastmark();
        case "no":
            return new No();
        case "pop":
            return new Pop();
        case "popenv":
            return new Popenv();
        case "prune":
            return new Prune();
        case "putanon":
            return new Putanon();
        case "setbtp":
            return new Setbtp();
        case "setcut":
            return new Setcut();
        case "unify":
            return new Unify();
        default:
            return new InvalidInstruction(input);
        }
    }

    private static parseSignStringLabelParamInstruction(instr: string, p0: SignLabel, p1: string, p2: Label): Instruction {
        switch (instr) {
        case "entry":
            return new Entry(p0, p1, p2);
        default:
            return new InvalidInstruction(instr + " " + p0 + " " + p1 + " " + p2);
        }
    }

    //</editor-fold>

    //<editor-fold> Validation Methods

    private static isValidLabel(label: string): boolean {
        const regex = new RegExp(".+");
        return regex.test(label);
    }

    private static isValidAtomName(label: string): boolean {
        const regex = new RegExp(".+");
        return regex.test(label);
    }

    private static isValidSignLabel(label: string): boolean {
        const split = label.split("/");
        if (split.length != 2) {
            return false;
        } else {
            return this.isValidLabel(split[0]) &&   //First part is valid label
                new RegExp("[0-9]+").test(split[1]); //Second part is number
        }
    }

    private static isValidNumber(arg: string): boolean {
        const regex = new RegExp("[0-9]+");
        return regex.test(arg);
    }

    private static isValidContext(arg: string): boolean {
        return (this.isValidSignLabel(arg) || this.isValidAtomName(arg));
    }

    //</editor-fold>
}
