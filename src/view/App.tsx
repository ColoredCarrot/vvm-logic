import React, {useState} from "react";
import "./App.css";
import {AppState, AppStateContext} from "./AppState";
import {LeftColumn} from "./LeftColumn";
import {Visualization} from "./visualization/Visualization";
import {State} from "../model/State";

function App() {
    const [state, setState] = useState<State>(State.new());

    const [appState, setAppState] = useState<AppState>({lastExecutionError: null});

    return <>
        <AppStateContext.Provider value={[appState, setAppState]}>
            <div className="App">
                <div className="left-column-container">
                    <LeftColumn state={state} setState={setState}/>
                </div>
                <div className="visualization-container">
                    <Visualization state={state}/>
                </div>
            </div>
        </AppStateContext.Provider>
    </>;
}

export default App;
