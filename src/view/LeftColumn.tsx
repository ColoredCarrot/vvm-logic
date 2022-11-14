import React, {useMemo} from "react";
import * as ProgText from "../model/ProgramText";
import {State} from "../model/State";
import {ControlPanel} from "./ControlPanel";
import "./LeftColumn.scss";
import {ProgramTextEditor} from "./ProgramTextEditor";
import {useLocallyStoredState} from "./util/UseLocallyStoredState";

interface LeftColumnProps {
    state: State;
}

export function LeftColumn({state}: LeftColumnProps) {
    const [rawProgramText, setRawProgramText] = useLocallyStoredState(["a:", "POP", "MARK a"], "program-text");

    // Parsing the program text is expensive, so only do it when it is actually changed
    const programText = useMemo(() => ProgText.parseProgramText(rawProgramText), [rawProgramText]);

    return <div className="LeftColumn">
        <ProgramText state={state} programText={programText} setProgramText={setRawProgramText}/>
        <ControlPanel programText={programText}/>
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
