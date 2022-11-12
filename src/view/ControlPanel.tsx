import "./ControlPanel.css";
import React from "react";
import {State} from "../model/State";
import {step} from "../exec/step";
import {ProgramText} from "../model/ProgramText";

interface ControlPanelProps {
    vmState: State;
    setVmState(newState: State): void;
    programText: ProgramText
}

export function ControlPanel({vmState, setVmState, programText}: ControlPanelProps) {

    const endOfProgram = vmState.programCounter + 1 >= programText.codeLineCount;

    const actionBtn = endOfProgram
        ? <a className="btn" onClick={() => {
            setVmState(State.new());
        }
        }>Restart</a>
        : <a className="btn" onClick={() => {
            setVmState(step(vmState, programText.codeLines[vmState.programCounter + 1].instruction));
        }
        }>Step</a>;

    return <div className="ControlPanel p">
        {actionBtn}
    </div>;
}
