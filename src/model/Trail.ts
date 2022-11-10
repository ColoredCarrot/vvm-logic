import Immutable from "immutable";
import {IllegalOperationError} from "../exec/ExecutionError";

export class Trail {
    private constructor(private readonly values: Immutable.List<number>) {
    }

    static empty(): Trail {
        return new Trail(Immutable.List());
    }

    push(value: number): Trail {
        return new Trail(this.values.push(value));
    }

    pop(): Trail {
        return new Trail(this.values.pop());
    }

    get(index: number): number {
        return this.values.get(index)!;
    }

    get trailPointer(): number {
        return this.values.size - 1;
    }

    setTrailPointer(tp: number): Trail {
        if (tp > this.trailPointer) {
            throw new IllegalOperationError("Attempting to set trail pointer to higher value would lead to uninitialized memory");
        }
        return new Trail(this.values.slice(0, tp + 1));
    }
}
