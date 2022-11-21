import React from "react";
import {State} from "../model/State";
import {ControlPanel} from "./ControlPanel";
import "./LeftColumn.scss";
import {ProgramTextEditor} from "./ProgramTextEditor";

interface LeftColumnProps {
    state: State;
}

export function LeftColumn({state}: LeftColumnProps) {
    return <div className="LeftColumn">
        <ControlPanel/>
        <ProgramText
            state={state}
        />
    </div>;
}

interface ProgramTextProps {
    state: State;
}

function ProgramText({
    state,
}: ProgramTextProps) {
    return <div className="ProgramText">
        <ProgramTextEditor
            vmState={state}
        />
    </div>;
}
