import React, {useState} from "react";
import {State} from "../model/State";
import {step} from "../exec/step";

interface LeftColumnProps {
    state: State;
    setState: (newState: State)=> void;
}

export function LeftColumn({state, setState}: LeftColumnProps) {
    const [programText, setProgramText] = useState("");

    const programTextLines = programText.split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);
    const nextInstrIdx = state.programCounter + 1;

    const endOfProgram = nextInstrIdx >= programTextLines.length;

    const actionBtn = endOfProgram
        ? <a className="btn" onClick={() => {
            setState(State.new());
        }
        }>Restart</a>
        : <a className="btn" onClick={() => {
            const instrText = programTextLines[nextInstrIdx];
            setState(step(state, instrText));
        }
        }>Step</a>;

    return <div className="h100 left-column">
        <div className="program-text p">
            <div className="h100">
                <div style={{display: "flex", height: "100%"}} className="h100">
                    <textarea
                        id="program-text"
                        className="program-text-input h100"
                        value={programText}
                        onChange={(elem) => setProgramText(elem.target.value)}></textarea>
                </div>
            </div>
        </div>
        <div className="control-panel p">
            {actionBtn}
        </div>
    </div>;
}
