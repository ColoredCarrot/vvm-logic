import Immutable from "immutable";
import React, {useMemo, useState} from "react";
import {useInterval} from "usehooks-ts";
import * as ProgText from "../model/ProgramText";
import {State} from "../model/State";
import {TextEditor} from "../model/text/TextEditor";
import "./App.scss";
import {AppState, AppStateContext, ProgramTextContext} from "./AppState";
import {LeftColumn} from "./LeftColumn";
import {step} from "./util/Step";
import {useLocallyStoredState} from "./util/UseLocallyStoredState";
import {Visualization} from "./visualization/Visualization";

function App() {
    const [appState, setAppState] = useState<AppState>({
        vmState: Immutable.List(),
        lastExecutionError: null,
        autoStepEnabled: false,
        autoStepSpeed: 0.5,
    });

    const [programTextEditor, setProgramTextEditor] = useLocallyStoredState(
        TextEditor.create,
        "program-text",
        {
            serializer: ed => ed.text,
            deserializer: text => TextEditor.forText(text),
        },
    );

    // Parsing the program text is expensive, so only do it when it is actually changed
    const programText = useMemo(() => ProgText.parseProgramText(programTextEditor.lines), [programTextEditor.lines]);

    const vmState = appState.vmState.last() ?? State.new();

    const autoStepInterval = calculateInterval(100, 3000, appState.autoStepSpeed);

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
                editor: programTextEditor,
                setEditor(editor: TextEditor): void {
                    setProgramTextEditor(editor);
                },
            }}>
                <div className="App">
                    <div className="left-column-container">
                        <LeftColumn
                            state={vmState}
                        />
                    </div>
                    <div className="visualization-container">
                        <Visualization/>
                    </div>
                </div>
            </ProgramTextContext.Provider>
        </AppStateContext.Provider>
    </>;
}

export function calculateInterval(min: number, max: number, mod: number): number {
    console.assert(mod >= 0 && mod <= 1);
    return min + (1 - mod) * (max - min);
}

export default App;
