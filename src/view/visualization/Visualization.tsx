import React from "react";
import {State} from "../../model/State";
import "./Visualization.css";

interface VisualizationProps {
    state: State;
}

export function Visualization({state}: VisualizationProps) {
    return <div className="Visualization">
        <h3>Visualization</h3>

        <code>{JSON.stringify(state)}</code>
    </div>;
}
