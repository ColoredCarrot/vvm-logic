import React from "react";
import {State} from "../model/State";

interface VisualizationProps {
    state: State;
}

export function Visualization({state}: VisualizationProps) {
    return <div>
        <h3>Visualization</h3>

        <p>State: {JSON.stringify(state)}</p>
    </div>;
}