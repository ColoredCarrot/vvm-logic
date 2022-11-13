import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {SignLabel} from "../SignLabel";

export class Entry extends Instruction {
    private readonly pred: SignLabel;
    private readonly cont: string;
    private readonly addr: number;

    /**
     * This Class is supposed to add an Entry to the try-chain HashMap
     * @param pred - ??
     * @param cont - ??
     * @param addr - ??
     */


    constructor(pred: SignLabel, cont: string, addr: number) {
        super("ENTRY " + pred + " " + cont + " " + addr);
        this.pred = pred;
        this.cont = cont;
        this.addr = addr;
    }

    step(state: State): State {
        return state.modifyTryChain(t => t.set(this.pred, this.cont, this.addr));
    }
}
