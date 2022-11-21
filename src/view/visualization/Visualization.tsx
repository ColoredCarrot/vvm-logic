import Cytoscape from "cytoscape";
import cytoscape from "cytoscape";
import cytoscapeFcose from "cytoscape-fcose";
import fcose, {FcoseLayoutOptions} from "cytoscape-fcose";
import React, {useRef} from "react";
import CytoscapeComponent from "react-cytoscapejs";
import {State} from "../../model/State";
import {STYLESHEET, TOTAL_NODE_HEIGHT} from "./NodeStyles";
import "./Visualization.scss";
import {createGraph, Graph} from "./VisualizationGraph";
import {StructCell} from "../../model/StructCell";
import {Range} from "immutable";

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

    const addrsInStructs = state.heap.all().entrySeq()
        // For each struct on the heap...
        .filter(([_, cell]) => cell instanceof StructCell)
        // ...generate [struct addr, struct addr + 1, ..., struct addr + struct size]
        .map(([addr, cell]) =>
            Range(0, (cell as StructCell).size + 1)
                .map(off => addr + off)
                .toArray()
        )
        .toArray();

    // All heap nodes are to the right of the stack
    const relPlacementConstraints: cytoscapeFcose.FcoseRelativePlacementConstraint[] = [
        ...state.heap.all().keySeq().toArray().map(address => ({
            left: "S0",
            right: "H" + address,
            gap: 1000,
        })),

        // Within structs, cells should be ordered by address
        ...addrsInStructs.flatMap(addrs =>
            addrs.slice(2).map((addr, i) => ({
                top: "H" + addrs[i + 1],
                bottom: "H" + addr,
                gap: TOTAL_NODE_HEIGHT,
            }))
        ),
    ];

    const alignConstraints: cytoscapeFcose.FcoseAlignmentConstraint = {
        // @ts-expect-error: The type annotations for FcoseAlignmentConstraint are incorrect;
        //                   we need vertical: string[][] instead of [string, string][]
        vertical: [
            ...addrsInStructs.map(addrs => addrs.map(addr => "H" + addr)),
        ],
        horizontal: [],
    };

    const fixedConstraints: cytoscapeFcose.FcoseFixedNodeConstraint[] = [
        // Registers:
        ...regs.map((reg, i) => ({
            nodeId: reg,
            position: {x: 0, y: -TOTAL_NODE_HEIGHT * i},
        })),
        // Stack:
        ...state.stack.toArray().map((_, i) => ({
            nodeId: "S" + i,
            position: {x: 1400, y: -TOTAL_NODE_HEIGHT * i},
        })),
    ];

    return {
        name: "fcose",
        animate: true,
        animationDuration: 800,
        randomize: false,
        quality: "proof",
        alignmentConstraint: alignConstraints,
        relativePlacementConstraint: relPlacementConstraints,
        fixedNodeConstraint: fixedConstraints,
        uniformNodeDimensions: true,
        nodeRepulsion: 1_000_000,
        //initialEnergyOnIncremental: 0.5,
        // Gravity force (constant) (0.25)
        gravity: 0.25,
        // Gravity range (constant) for compounds (1.5)
        gravityRangeCompound: 1.5,
        // Gravity force (constant) for compounds (1.0)
        gravityCompound: 1.0,
        // Gravity range (constant)
        gravityRange: 3.8,
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
