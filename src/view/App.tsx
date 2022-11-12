import React, {useState} from "react";
import "./App.css";
import {LeftColumn} from "./LeftColumn";
import {Visualization} from "./Visualization";
import {State} from "../model/State";

function App() {
    const [state, setState] = useState<State>(State.new());

    return <>
        <LeftColumn state={state} setState={setState}/>
        <Visualization state={state}/>
    </>;
}

export default App;
