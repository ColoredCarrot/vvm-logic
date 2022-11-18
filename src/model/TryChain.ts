import Immutable from "immutable";
import {SignLabel} from "../exec/SignLabel";
import {ExecutionError} from "../exec/ExecutionError";
import {Label} from "../exec/Label";

export class TryChainKey {
    constructor(
        readonly pred: SignLabel,
        readonly context: string,
    ) {}
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

    set(pred: SignLabel, cont: string, jumpTo: Label): TryChain {
        return new TryChain(this.values.set(new TryChainKey(pred, cont), jumpTo.line));
    }

    get(pred: SignLabel, cont: string): number {
        const tryWithContext: number | undefined = this.values.find((value, key) => {
            return key.context === cont && key.pred.text === pred.text; });

        if (tryWithContext !== undefined) {
            return tryWithContext;
        } else {
            const tryDefault: number | undefined = this.values.find((value, key) => {
                return key.pred.text === pred.text && key.context === "default";
            });

            if (tryDefault) {
                return tryDefault;
            } else {
                throw new ExecutionError("TryChain does not contain entry for " + pred.text + " " + cont);
            }
        }
    }
}
