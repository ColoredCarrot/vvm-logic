import Cytoscape from "cytoscape";
import cytoscape from "cytoscape";
import cytoscapeFcose from "cytoscape-fcose";
import fcose, {FcoseLayoutOptions} from "cytoscape-fcose";
import React, {useRef} from "react";
import CytoscapeComponent from "react-cytoscapejs";
import "springy/springy";
import {State} from "../../model/State";
import {STYLESHEET} from "./NodeStyles";
import "./Visualization.scss";
import {createGraph, Graph} from "./VisualizationGraph";

Cytoscape.use(fcose);

interface VisualizationProps {
    state: State;
}

export function Visualization({state}: VisualizationProps) {

    /////////////
    // Don't display heap cells whose address is >= heap pointer
    /////////////

    return <div className="Visualization">
        <h3>Visualization</h3>

        <VisualizationGraph state={state}/>
    </div>;
}

function generateLayout(state: State, graph: Graph): FcoseLayoutOptions {
    cytoscape.use(fcose);

    // The following is the display order of the registers:
    const regs = ["SP", "PC", "FP", "BP", "HP"]
        .filter(reg => graph.nodes.some(n => n.data.id === reg));

    // All heap nodes are to the right of the stack
    const relPlacementConstraints: cytoscapeFcose.FcoseRelativePlacementConstraint[] = [
        ...state.heap.all().keySeq().toArray().map(address => ({
            left: "S0",
            right: "H" + address,
            gap: 1000,
        })),
    ];

    const fixedConstraints: cytoscapeFcose.FcoseFixedNodeConstraint[] = [
        // Registers:
        ...regs.map((reg, i) => ({
            nodeId: reg,
            position: {x: 0, y: -100 * i},
        })),
        // Stack:
        ...state.stack.toArray().map((_, i) => ({
            nodeId: "S" + i,
            position: {x: 1200, y: -100 * i},
        })),
    ];

    return {
        name: "fcose",
        animate: true,
        animationDuration: 800,
        randomize: false,
        quality: "proof",
        // alignmentConstraint: alignConstraints,
        relativePlacementConstraint: relPlacementConstraints,
        fixedNodeConstraint: fixedConstraints,
    };
}

function VisualizationGraph({state}: VisualizationProps) {

    const cyRef = useRef<Cytoscape.Core>();

    const graph = createGraph(state);

    return <CytoscapeComponent
        cy={cy => cyRef.current = cy}
        className="Visualization__Cytoscape"
        stylesheet={STYLESHEET}
        elements={CytoscapeComponent.normalizeElements(graph)}
        layout={generateLayout(state, graph)}
        wheelSensitivity={0.3}
    />;
}
