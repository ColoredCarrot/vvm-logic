import React from "react";
import {State} from "../../model/State";
import "./Visualization.scss";
import {MyDiagram, Register, Stack} from "./TestGraph";
import {Canvas} from "reaflow";
import {DEFAULT_ENCODING} from "crypto";

interface VisualizationProps {
    prevState: State;
    state: State;
}

export function Visualization({prevState, state}: VisualizationProps) {

    /////////////
    // Don't display heap cells whose address is >= heap pointer
    /////////////

    return <div className="Visualization">
        <h3>Visualization</h3>

        <code style={{whiteSpace: "pre-wrap"}}>{JSON.stringify(state, null, 2)}</code>
       {/* <Register key={null}/>*/}
        {/*<Stack key={null}/>
        <MyDiagram key={null}/>*/}

    </div>;
}
