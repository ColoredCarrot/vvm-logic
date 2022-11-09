import React, {useState} from "react";
import "./App.css";
import {LeftColumn} from "./LeftColumn";
import {Visualization} from "./Visualization";
import {State} from "../model/State";

function App() {
    const [state, setState] = useState<State>(new State());

    return (
        <div className="container">
            <div className="row">
                <div className="col s4">
                    <LeftColumn state={state} setState={setState}></LeftColumn>
                </div>
                <div className="col s8">
                </div>
                <Visualization state={state}/>
            </div>
        </div>
    );
}

export default App;
