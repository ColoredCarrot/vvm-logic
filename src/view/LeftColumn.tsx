import React, {useMemo, useState} from "react";
import {parseProgramText, ProgramText as ProgText} from "../model/ProgramText";
import {State} from "../model/State";
import {ControlPanel} from "./ControlPanel";
import "./LeftColumn.css";

interface LeftColumnProps {
    state: State;
    setState: (newState: State) => void;
}

export function LeftColumn({state, setState}: LeftColumnProps) {
    const [rawProgramText, setRawProgramText] = useState("");

    // Parsing the program text is expensive, so only do it when it is actually changed
    const programText = useMemo(() => parseProgramText(rawProgramText), [rawProgramText]);

    return <div className="LeftColumn">
        <ProgramText programText={programText} setProgramText={setRawProgramText}/>
        <ControlPanel vmState={state} setVmState={setState} programText={programText}/>
    </div>;
}

interface ProgramTextProps {
    programText: ProgText;
    setProgramText(raw: string): void;
}

function ProgramText({programText, setProgramText}: ProgramTextProps) {
    return <div className="ProgramText p">
        <textarea
            id="program-text"
            className="program-text-input h100"
            value={programText.raw}
            onChange={(elem) => setProgramText(elem.target.value)}></textarea>
    </div>;
}
