import Immutable from "immutable";
import {SignLabel} from "../exec/SignLabel";
import {ExecutionError} from "../exec/ExecutionError";

export class TryChainKey {
    private pred: SignLabel;
    private context: string;

    constructor(pred: SignLabel, context: string) {
        this.pred = pred;
        this.context = context;
    }
}

export class TryChain {

    private constructor(
        private readonly values: Immutable.Map<TryChainKey, number>,
    ) {
    }

    get size(): number {
        return this.values.size;
    }

    static empty(): TryChain {
        return new TryChain(Immutable.Map());
    }

    set(pred: SignLabel, cont: string, addr: number): TryChain {
        return new TryChain(this.values.set(new TryChainKey(pred, cont), addr));
    }

    get(pred: SignLabel, cont: string): number {
        const newPC = this.values.get(new TryChainKey(pred, cont));
        if (!newPC) {
            throw new ExecutionError("TryChain Entry not defined");
        }

        return newPC;
    }
}
