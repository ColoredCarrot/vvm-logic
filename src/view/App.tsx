import React, {useState} from "react";
import "./App.css";
import {LeftColumn} from "./LeftColumn";
import {Visualization} from "./Visualization";
import {State} from "../model/State";

function App() {
    const [state, setState] = useState<State>(State.new());

    return <>
        <div className="left-column-container">
            <LeftColumn state={state} setState={setState}/>
        </div>
        <Visualization state={state}/>
    </>;
}

export default App;
