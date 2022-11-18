import React, {useState} from "react";
import "./App.scss";
import {AppState, AppStateContext} from "./AppState";
import {LeftColumn} from "./LeftColumn";
import {Visualization} from "./visualization/Visualization";
import {State} from "../model/State";
import Immutable from "immutable";

function App() {
    const [appState, setAppState] = useState<AppState>({
        vmState: Immutable.List(),
        lastExecutionError: null,
    });

    const vmState = appState.vmState.last() ?? State.new();

    return <>
        <AppStateContext.Provider value={[appState, setAppState]}>
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
        </AppStateContext.Provider>
    </>;
}

export default App;
