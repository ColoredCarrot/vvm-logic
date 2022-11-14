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

        const inputSplit: string[] = input.split(" ");
        const instr: string = inputSplit.at(0)!;

        const params: string[] = inputSplit.slice(1);

        if (params.length == 0) {
            return this.parseNoParamInstruction(instr);
        } else if (params.length == 1) {
            const param: string = params.pop()!;

            if (this.isValidSignLabel(param)) {
                const signLabel = labels.find(v => {
                    return v.text === param;
                });
                if (!signLabel) {
                    //ERROR
                    throw new ParseError("Label not found: " + signLabel);
                }
                return this.parseSignParamInstruction(instr, <SignLabel>signLabel);
            } else if (this.isValidLabel(param) && labels.find(v => {
                return v.text === param;
            })) {
                const l1: Label = labels.find(v => {
                    return v.text === param;
                })!;
                return this.parseLabelParamInstruction(instr, l1);
            } else if (this.isValidAtomName(param)) {
                return this.parseStringParamInstructor(instr, param);
            } else if (this.isValidNumber(param)) {
                return this.parseNumberParamInstruction(instr, Number(param));
            }
        } else if (params.length == 2) {
            const p1 = params.pop()!;
            const p0 = params.pop()!;

            if (this.isValidSignLabel(p0) && this.isValidLabel(p1)) {
                const l0 = <SignLabel>labels.find(v => {
                    return v.text === p0 && v instanceof SignLabel;
                });
                const l1 = labels.find(v => {
                    return v.text === p0;
                });
                if (!l0 || !l1) {
                    //ERROR
                    throw new ParseError("Label not found: " + p0);
                }
                return this.parseSignAndLabelParamInstruction(instr, l0!, l1!);
            } else if (this.isValidSignLabel(p0) && this.isValidNumber(p1)) {
                const l0 = <SignLabel>labels.find(v => {
                    return v.text === p0 && v instanceof SignLabel;
                });
                if (!l0) {
                    throw new ParseError("Label not found!");
                }
                return this.parseSignAndNumberParamInstruction(instr, l0, Number(p1));
            } else if (this.isValidNumber(p0) && this.isValidNumber(p1)) {
                return this.parseNumberNumberParamInstruction(instr, Number(p0), Number(p1));
            }
        } else {
            //TODO: Error for >2 Parameters
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
            return new InvalidInstruction(instr + " " + param.text); //TODO: Replace with actual implementation
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
        case "halt":
            return new InvalidInstruction(instr + " " + param); //TODO: Replace with actual Implementation
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
            return new InvalidInstruction(instr + param); //TODO: Replace with actual Implementation
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
            return new Pop(); //TODO: Change to actual Constructor
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
            return new Delbtp(); //TODO: Replace once implemented
        case "fail":
            return new Fail();
        case "getnode":
            return new InvalidInstruction(input); //TODO: Replace once implemented
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
            return new InvalidInstruction(input); //TODO: Replace once implemented
        case "setcut":
            return new InvalidInstruction(input); //TODO: Replace once implemented
        case "unify":
            return new Unify();
        default:
            return new InvalidInstruction(input);
        }
    }

    //</editor-fold>

    //<editor-fold> Validation Methods
    //TODO: Actually Implement with regex??
    private static isValidLabel(label: string): boolean {
        const regex = new RegExp(".");
        return regex.test(label);
    }

    private static isValidAtomName(label: string): boolean {
        const regex = new RegExp(".+");
        return regex.test(label);
    }

    private static isValidSignLabel(label: string): boolean {
        const regex = new RegExp(".+/[0-9]+");
        return regex.test(label);
    }

    private static isValidNumber(arg: string): boolean {
        const regex = new RegExp("[0-9]+");
        return regex.test(arg);
    }

    //</editor-fold>
}
