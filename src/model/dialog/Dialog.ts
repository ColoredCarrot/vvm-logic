import {State} from "../State";
import React from "react";

export abstract class Dialog<C extends readonly string[]> {

    protected constructor(readonly choices: C) {}

    abstract renderContent(): React.ReactElement;

    abstract apply(choice: C[number], state: State): State;

}
