import React from "react";
import {State} from "../../model/State";
import "./Visualization.scss";

interface VisualizationProps {
    state: State;
}

export function Visualization({state}: VisualizationProps) {
    return <div className="Visualization">
        <h3>Visualization</h3>

        <code style={{whiteSpace: "pre-wrap"}}>{JSON.stringify(state, null, 2)}</code>
    </div>;
}