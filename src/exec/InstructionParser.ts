import {Instruction} from "./instructions/Instruction";
import {Label} from "./Label";
import {Pop} from "./instructions/Pop";
import {Bind} from "./instructions/Bind";
import {InvalidInstruction} from "./instructions/InvalidInstruction";
import {Call} from "./instructions/Call";
import {SignLabel} from "./SignLabel";

export class InstructionParser {

    static parseInput(inputLines: string[]): [Instruction[], Label[]] {
        let labels: Label[]
            = this.processLabels(inputLines);

        let instructions: Instruction[]
            = this.parseInstructions(inputLines, labels);

        return [instructions, labels];
    }

    private static parseInstructions(input: string[], labels: Label[]): Instruction[] {
        for (let value of input) {
            //Remove leading/trailing spaces
            value = value.trim();
            //Replace multiple spaces with single space
            value = value.replace("/  +/g", " ");
            value = value.toLowerCase();
        }

        let instructions: Instruction[] = [];
        for (const value of input) {
            instructions.push(this.parseInstruction(value, labels));
        }

        return instructions;
    }

    private static parseInstruction(input: string, labels: Label[]): Instruction {
        let inputSplit: string[] = input.split(" ");
        let instr: string = inputSplit.at(0)!;

        let params: string[] = inputSplit.slice(1);

        if (params.length == 0) {
            return this.parseNoParamInstruction(instr);
        } else if (params.length == 1) {
            let param: string = params.pop()!;

            if (this.isValidSignLabel(param)) {
                let signLabel = labels.find(v => {return v.text === param})
                if(!signLabel) {
                    //ERROR
                    throw new DOMException("Label not found!");
                }
                return this.parseSignParamInstruction(instr, <SignLabel>signLabel)
            }  else  if(this.isValidLabel(param) && labels.find(v => {return v.text === param})) {
                let l1 : Label = labels.find(v => {return v.text === param})!
                return this.parseLabelParamInstruction(instr, l1);
            }else if(this.isValidAtomName(param)) {
                return this.parseStringParamInstructor(instr, param);
            } else if(this.isValidNumber(param)) {
                return this.parseNumberParamInstruction(instr, +param)
            }
        } else if (params.length == 2) {
            let p1 = params.pop()!;
            let p0 = params.pop()!;

            if(this.isValidSignLabel(p0) && this.isValidLabel(p1)) {
                let l0 = <SignLabel> labels.find(v => {return v.text === p0 && v instanceof SignLabel})
                let l1 = labels.find(v => {return v.text === p0})
                if(!l0 || !l1) {
                    //ERROR
                    throw new DOMException("Label not found!");
                }
                return this.parseSignAndLabelParamInstruction(instr, l0!, l1!)
            } else if(this.isValidSignLabel(p0) && this.isValidNumber(p1)) {
                let l0 = <SignLabel> labels.find(v => {return v.text === p0 && v instanceof SignLabel})
                if(!l0) {
                    throw new DOMException("Label not found!");
                }
                return this.parseSignAndNumberParamInstruction(instr, l0, +p1);
            } else if(this.isValidNumber(p0) && this.isValidNumber(p1)) {
                return this.parseNumberNumberParamInstruction(instr, +p0, +p1);
            }
        } else {
            //TODO: Error for >2 Parameters
        }


        return new InvalidInstruction(input);
    }

    private static processLabels(inputLines: string[]): Label[] {
        let labels: Label[] = []

        for (let i = 0; i < inputLines.length; i++) {
            let line = inputLines.at(i)!;
            let lblSplit = line.split(":");
            if (lblSplit.length > 2) {
                //TODO: Error?
            } else if (lblSplit.length > 1) {
                //Line has a label
                labels.push(new Label(i, lblSplit.at(0)!));
                inputLines[i] = lblSplit.at(1)!;
            } else {
                //Line has no label
            }
        }

        return labels;
    }

    //<editor-fold> parse different Parameter Methods
    private static parseNumberNumberParamInstruction(instr:string, p0 : number, p1:number) : Instruction {
        switch (instr) {
            case "slide":
                return new InvalidInstruction(instr + " " + p0 + " " + p1); //TODO: Replace with actual implementation
            default:
                return new InvalidInstruction(instr + " " + p0 + " " + p1);
        }
    }

    private static parseLabelParamInstruction(instr : string, param : Label) : Instruction {
        switch (instr) {
            case "init":
                return new InvalidInstruction(instr + " " + param.text); //TODO: Replace with actual implementation
            case "mark":
                return new InvalidInstruction(instr + " " + param.text); //TODO: Replace with actual implementation
            case "try":
                return new InvalidInstruction(instr + " " + param.text); //TODO: Replace with actual implementation
            case "up":
                return new InvalidInstruction(instr + " " + param.text); //TODO: Replace with actual implementation
            default:
                return new InvalidInstruction(instr + " " + param.text)
        }
    }

    private static parseStringParamInstructor(instr: string, param : string) : Instruction {
        switch (instr) {
            case "halt":
                return new InvalidInstruction(instr + " " + param); //TODO: Replace with actual Implementation
            case "putatom":
                return new InvalidInstruction(instr + " " + param); //TODO: Replace with actual Implementation
            case "uatom":
                return new InvalidInstruction(instr + " " + param); //TODO: Replace with actual Implementation
            default:
                return new InvalidInstruction(instr + " " + param);
        }
    }

    private static parseNumberParamInstruction(instr: string, param : number) : Instruction {
        switch (instr) {
            case "check":
                return new InvalidInstruction(instr + param); //TODO: Replace with actual Implementation
            case "pushenv":
                return new InvalidInstruction(instr + param); //TODO: Replace with actual Implementation
            case "putref":
                return new InvalidInstruction(instr + param); //TODO: Replace with actual Implementation
            case "putvar":
                return new InvalidInstruction(instr + param); //TODO: Replace with actual Implementation
            case "son":
                return new InvalidInstruction(instr + param); //TODO: Replace with actual Implementation
            case "trim":
                return new InvalidInstruction(instr + param); //TODO: Replace with actual Implementation
            case "uref":
                return new InvalidInstruction(instr + param); //TODO: Replace with actual Implementation
            case "uvar":
                return new InvalidInstruction(instr + param); //TODO: Replace with actual Implementation
        }
        return new InvalidInstruction(instr + param)
    }

    private static parseSignAndLabelParamInstruction(instr: string, sign: SignLabel, label: Label): Instruction {
        switch (instr) {
            case "ustruct":
                return new Pop(); //TODO: Replace with actual Constructor
            default:
                return new InvalidInstruction(instr + " " + sign + " " + label);
        }
    }

    private static parseSignAndNumberParamInstruction(instr: string, sign: SignLabel, secondParam: number): Instruction {
        switch (instr) {
            case "lastcall":
                return new Pop(); //TODO: Change to actual Constructor
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
                return new Pop(); //TODO: Change to actual Constructor
            case "putstruct":
                return new Pop(); //TODO: Change to actual Constructor
            default:
                return new InvalidInstruction(instr + " " + sign.text);
        }
    }

    private static parseNoParamInstruction(input: string): Instruction {
        switch (input) {
            case "bind":
                return new Bind();
            case "delbtp":
                return new InvalidInstruction(input); //TODO: Replace once implemented
            case "fail":
                return new InvalidInstruction(input); //TODO: Replace once implemented
            case "getnode":
                return new InvalidInstruction(input); //TODO: Replace once implemented
            case "lastmark":
                return new InvalidInstruction(input); //TODO: Replace once implemented
            case "pop":
                return new Pop();
            case "popenv":
                return new InvalidInstruction(input); //TODO: Replace once implemented
            case "prune":
                return new InvalidInstruction(input); //TODO: Replace once implemented
            case "putanon":
                return new InvalidInstruction(input); //TODO: Replace once implemented
            case "setbtp":
                return new InvalidInstruction(input); //TODO: Replace once implemented
            case "setcut":
                return new InvalidInstruction(input); //TODO: Replace once implemented
            case "unify":
                return new InvalidInstruction(input); //TODO: Replace once implemented
            default:
                return new InvalidInstruction(input);
        }
    }
    //</editor-fold>

    //<editor-fold> Validation Methods
    //TODO: Actually Implement with regex??
    private static isValidLabel(label: string): boolean {
        return true;
    }

    private static isValidAtomName(label: string): boolean {
        return true;
    }

    private static isValidSignLabel(label: string): boolean {
        //Actually Implement
        return true;
    }

    private static isValidNumber(arg : string) : boolean {
        return true;
    }

    //</editor-fold>
}