import React from "react";
import {State} from "../State";
import {Dialog} from "./Dialog";

const CHOICES = [] as const;

export class NoDialog extends Dialog<typeof CHOICES> {

    constructor() {
        super(CHOICES);
    }

    renderContent(): React.ReactElement {
        return <div>
            <em>NO!</em> There are no results.
        </div>;
    }

    apply(choice: typeof CHOICES[number], state: State): State {
        return state;
    }
}
