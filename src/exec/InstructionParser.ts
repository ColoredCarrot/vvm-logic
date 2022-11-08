import {Instruction} from "./instructions/Instruction";
import { Label } from "./Label";

export class InstructionParser {


    static parseInstructions(inputLines : string[]) : [Instruction[], Label[]] {
        let instructions : Instruction[] = []
        let labels : Label[];
        labels = this.processLabels(inputLines);

        return [[],labels];
    }

    private static processLabels(inputLines : string[]) : Label[] {
        let labels : Label[] = []

        for (let i = 0; i < inputLines.length; i++) {
            let line = inputLines.at(i)!;
            let lblSplit = line.split(":");
            if(lblSplit.length > 2) {
                //TODO: Error?
            } else if(lblSplit.length > 1) {
                //Line has a label
                labels.push(new Label(i, lblSplit.at(0)!));
                inputLines[i] = lblSplit.at(1)!;
            } else {
                //Line has no label
            }
        }

        return labels;
    }
}