import React, {useMemo, useState} from "react";
import * as ProgText from "../model/ProgramText";
import {State} from "../model/State";
import {ControlPanel} from "./ControlPanel";
import "./LeftColumn.css";
import {ProgramTextEditor} from "./ProgramTextEditor";

interface LeftColumnProps {
    state: State;
    setState: (newState: State) => void;
}

export function LeftColumn({state, setState}: LeftColumnProps) {
    const [rawProgramText, setRawProgramText] = useState(["a:", "POP", "MARK a"] as readonly string[]);

    // Parsing the program text is expensive, so only do it when it is actually changed
    const programText = useMemo(() => ProgText.parseProgramText(rawProgramText), [rawProgramText]);

    return <div className="LeftColumn">
        <ProgramText state={state} programText={programText} setProgramText={setRawProgramText}/>
        <ControlPanel vmState={state} setVmState={setState} programText={programText}/>
    </div>;
}

interface ProgramTextProps {
    state: State;
    programText: ProgText.Text;
    setProgramText(rawLines: string[]): void;
}

function ProgramText({state, programText, setProgramText}: ProgramTextProps) {
    return <div className="ProgramText">
        <ProgramTextEditor vmState={state} programText={programText} setProgramText={setProgramText}/>
    </div>;
}
