import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {SignLabel} from "../SignLabel";
import {Label} from "../Label";

export class Entry extends Instruction {
    private readonly pred: SignLabel;
    private readonly cont: string;
    private readonly jumpTo: Label;

    /**
     * This Class is supposed to add an Entry to the try-chain HashMap
     * @param pred - A SignLabel later used in index to access entry
     * @param cont - Name of Atom, "R" or "default"
     * @param jumpTo
     */

    constructor(pred: SignLabel, cont: string, jumpTo: Label) {
        super("ENTRY " + pred.text + " " + cont + " " + jumpTo.text);
        this.pred = pred;
        this.cont = cont.toLowerCase();
        this.jumpTo = jumpTo;
    }

    step(state: State): State {
        return state.modifyTryChain(t => t.set(this.pred, this.cont, this.jumpTo));
    }
}
