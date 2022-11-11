import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {SignLabel} from "../SignLabel";

export class Call extends Instruction {

    readonly sign: string;
    readonly size: number;
    readonly labelLine: number;

    /**
     *
     * @param label - SignLabel (only labels that look like f/2)
     */
    constructor(label: SignLabel) {
        super("CALL " + label.text);
        this.labelLine = label.line;
        this.sign = label.text;
        this.size = label.size;
    }

    step(state: State): State {

        return state
            .setFramePointer(state.stack.stackPointer - this.size)
            .setProgramCounter(this.labelLine);
    }
}
