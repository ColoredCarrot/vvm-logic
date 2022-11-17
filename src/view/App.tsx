import React, {useMemo, useState} from "react";
import "./App.scss";
import {AppState, AppStateContext, ProgramTextContext} from "./AppState";
import {LeftColumn} from "./LeftColumn";
import {Visualization} from "./visualization/Visualization";
import {State} from "../model/State";
import Immutable from "immutable";
import {useInterval} from "usehooks-ts";
import {step} from "./util/Step";
import {useLocallyStoredState} from "./util/UseLocallyStoredState";
import * as ProgText from "../model/ProgramText";

function App() {
    const [appState, setAppState] = useState<AppState>({
        vmState: Immutable.List(),
        lastExecutionError: null,
        autoStepEnabled: false,
    });

    const [rawProgramText, setRawProgramText] = useLocallyStoredState([""], "program-text");

    // Parsing the program text is expensive, so only do it when it is actually changed
    const programText = useMemo(() => ProgText.parseProgramText(rawProgramText), [rawProgramText]);

    const [caret, setCaret] = useState<ProgText.Caret>([0, 0]);

    const vmState = appState.vmState.last() ?? State.new();

    const [autoStepInterval, setAutoStepInterval] = useState(1500);//TODO move to AppState

    useInterval(
        () => {
            const nextCodeLine = programText.getNextCodeLine(vmState.programCounter);
            if (nextCodeLine !== null) {
                step(nextCodeLine, appState, setAppState);
            }
        },
        appState.autoStepEnabled ? autoStepInterval : null
    );

    return <>
        <AppStateContext.Provider value={[appState, setAppState]}>
            <ProgramTextContext.Provider value={{
                programText: programText,
                setProgramText(lines: string[]): void {
                    setRawProgramText(lines);
                },
                setProgramTextFromExternal(raw: string): void {
                    setRawProgramText(raw.split("\n").map(ln => ln.replaceAll(/[^0-9a-z/: ]/ig, "")));
                    setCaret([0, 0]);
                },
                caret: caret,
                setCaret(caret: ProgText.Caret): void {
                    setCaret(caret);
                },
            }}>
                <div className="App">
                    <div className="left-column-container">
                        <LeftColumn
                            state={vmState}
                        />
                    </div>
                    <div className="visualization-container">
                        <Visualization
                            prevState={appState.vmState.get(appState.vmState.size - 2) ?? State.new()}
                            state={vmState}
                        />
                    </div>
                </div>
            </ProgramTextContext.Provider>
        </AppStateContext.Provider>
    </>;
}

export default App;
