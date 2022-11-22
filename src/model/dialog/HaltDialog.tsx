import React from "react";
import {State} from "../State";
import {Dialog} from "./Dialog";
import {Fail} from "../../exec/instructions/Fail";

const CHOICES = ["continue"] as const;

export class HaltDialog extends Dialog<typeof CHOICES> {

    constructor(private readonly values: readonly string[]) {
        super(CHOICES);
    }

    renderContent(): React.ReactElement {
        return <div>
            {this.values.length === 0 ? <em>No results</em> : this.values.map((v, i) => <div key={v}>{i + 1}: {v}</div>)}
        </div>;
    }

    apply(choice: typeof CHOICES[number], state: State): State {
        return new Fail().step(state);
    }
}
