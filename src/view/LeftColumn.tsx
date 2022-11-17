import React, {useMemo, useState} from "react";
import * as ProgText from "../model/ProgramText";
import {State} from "../model/State";
import {ControlPanel} from "./ControlPanel";
import "./LeftColumn.scss";
import {ProgramTextEditor} from "./ProgramTextEditor";
import {useLocallyStoredState} from "./util/UseLocallyStoredState";

interface LeftColumnProps {
    state: State;
}

export type Caret = readonly [number, number];

export function LeftColumn({state}: LeftColumnProps) {
    const [rawProgramText, setRawProgramText] = useLocallyStoredState([""], "program-text");

    // Parsing the program text is expensive, so only do it when it is actually changed
    const programText = useMemo(() => ProgText.parseProgramText(rawProgramText), [rawProgramText]);

    const [caret, setCaret] = useState<Caret>([0, 0]);

    function setProgramTextFromExternal(text: string) {
        setRawProgramText(text.split("\n").map(ln => ln.replaceAll(/[^0-9a-z/: ]/ig, "")));
        setCaret([0, 0]);
    }

    return <div className="LeftColumn">
        <ControlPanel programText={programText} setProgramTextFromExternal={setProgramTextFromExternal}/>
        <ProgramText
            state={state}
            programText={programText} setProgramText={setRawProgramText}
            setProgramTextFromExternal={setProgramTextFromExternal}
            caret={caret} setCaret={setCaret}
        />
    </div>;
}

interface ProgramTextProps {
    state: State;

    programText: ProgText.Text;
    setProgramText(rawLines: string[]): void;
    setProgramTextFromExternal(raw: string): void;

    caret: Caret;
    setCaret(newCaret: Caret): void;
}

function ProgramText({
    state,
    programText,
    setProgramText,
    setProgramTextFromExternal,
    caret,
    setCaret,
}: ProgramTextProps) {
    return <div className="ProgramText">
        <ProgramTextEditor
            vmState={state}
            programText={programText} setProgramText={setProgramText}
            setProgramTextFromExternal={setProgramTextFromExternal}
            caret={caret} setCaret={setCaret}
        />
    </div>;
}
