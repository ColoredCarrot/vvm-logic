import React from "react";
import {State} from "../model/State";
import {step} from "../exec/step";

interface LeftColumnProps {
    state: State;
    setState: (newState: State) => void;
}

export function LeftColumn({state, setState}: LeftColumnProps) {
    return <>
        <div className="row">
            <div className="input-field col s12">
                <textarea id="program-text" className="materialize-textarea" rows={80}></textarea>
                <label htmlFor="program-text">Program Text</label>
            </div>
        </div>
        <div className="row">
            <a className="btn" onClick={() => setState(step(state, "IADD 1 2"))}>
                Step
            </a>
        </div>
    </>;
}
