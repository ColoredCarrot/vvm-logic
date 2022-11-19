import React, {useState} from "react";
import {State} from "../model/State";
import {ControlPanel} from "./ControlPanel";
import "./LeftColumn.scss";
import {ProgramTextEditor} from "./ProgramTextEditor";
import {Caret} from "../model/ProgramText";

interface LeftColumnProps {
    state: State;
}

export function LeftColumn({state}: LeftColumnProps) {
    const [caret, setCaret] = useState<Caret>([0, 0]);

    return <div className="LeftColumn">
        <ControlPanel/>
        <ProgramText
            state={state}
            caret={caret} setCaret={setCaret}
        />
    </div>;
}

interface ProgramTextProps {
    state: State;
    caret: Caret;
    setCaret(newCaret: Caret): void;
}

function ProgramText({
    state,
    caret,
    setCaret,
}: ProgramTextProps) {
    return <div className="ProgramText">
        <ProgramTextEditor
            vmState={state}
            caret={caret} setCaret={setCaret}
        />
    </div>;
}
