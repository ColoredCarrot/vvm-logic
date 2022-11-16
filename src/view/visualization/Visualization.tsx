import React, {useLayoutEffect, useRef} from "react";
import {State} from "../../model/State";
import Cytoscape from "cytoscape";
import cytoscape from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";
import "./Visualization.scss";
import "springy/springy";
import fcose from "cytoscape-fcose";

Cytoscape.use(fcose);

interface VisualizationProps {
    prevState: State;
    state: State;
}

export function Visualization({prevState, state}: VisualizationProps) {

    /////////////
    // Don't display heap cells whose address is >= heap pointer
    /////////////

    return <div className="Visualization" id="visualization">
        <h3>Visualization</h3>

        <VisualizationGraph state={state} prevState={prevState}/>
    </div>;
}

function generateLayout(state: State, cy: React.MutableRefObject<Cytoscape.Core | undefined>): cytoscape.LayoutOptions {
    //Try with cose
    cytoscape.use(fcose);
    let stackVertAlignment = "";
    let stackVertRelPlacement = "";
    if (state.stack.size > 0) {
        stackVertAlignment = "[";
        for (let i = 0; i < state.stack.size; i++) {
            if (i == state.stack.size - 1) {
                //Last
                stackVertAlignment = stackVertAlignment + "\"S" + i + "\"";
            } else {
                stackVertAlignment = stackVertAlignment + "\"S" + i + "\",";
            }
        }
        stackVertAlignment = stackVertAlignment + "],";

        for (let i = 1; i < state.stack.size; i++) {
            stackVertRelPlacement +=
                "{\"top\": \"S" + i + "\"," +
                "\"bottom\": \"S" + (i - 1) + "\"," +
                "\"gap\": 0}";
            if (i < state.stack.size - 1)
                stackVertRelPlacement += ",";
        }
    }

    const relPlacementJson = JSON.parse("[" + stackVertRelPlacement + "]");

    const registerVertAlignment = "[\"PC\",\"BP\"]";
    const alignmentConstraints = "{\"vertical\": [" + stackVertAlignment + registerVertAlignment + "]}";
    const alignmentJson = JSON.parse(alignmentConstraints);

    return {
        name: "fcose",
        // @ts-ignore
        animate: true,
        randomize: false,
        alignmentConstraint: alignmentJson,
        relativePlacementConstraint: relPlacementJson,
    };
}

function VisualizationGraph({state}: VisualizationProps) {

    const cy = useRef<Cytoscape.Core>();

    useLayoutEffect(() => {
        //cy.current!.$id("s3").positions({x: 300, y: 300}).lock();
        cy.current!
            .layout(generateLayout(state, cy)).run();
    });

    const nodes = [];
    const edges = [];

    const programmCounter = state.programCounter;
    nodes.push(
        {
            data: {id: "PC", label: programmCounter, type: "register-value"},
            style: {label: programmCounter},
        });

    const backtrackPointer = state.backtrackPointer;
    nodes.push({
        data: {id: "BP", label: backtrackPointer, type: "register-value"},
        style: {label: backtrackPointer},
    });

    for (let i = 0; i < state.stack.size; ++i) {
        const cell = state.stack.get(i);

        if (i < 5) {
            nodes.push({data: {id: "s" + i, label: "Node " + i, type: "stack"}, position: {x: 100, y: 100 * i}});
        } else {
            nodes.push({data: {id: "s" + i, label: "Node " + i, type: "heap"}});
            edges.push({
                data: {
                    id: "e" + i,
                    source: "s" + i,
                    target: "s" + Math.floor(Math.random() * i),
                    type: "heap",
                },
            });
        }
    }


    return <CytoscapeComponent
        cy={theCy => {
            cy.current = theCy;
            //   cy.current.on("tapend", function(ev) {
            //       cy.current!.layout(generateLayout(state, cy)).run();
            //   });
        }}

        style={{width: "100%", height: "100%"}}
        stylesheet={[
            {
                selector: "node",
                style: {
                    width: 50,
                    height: 20,
                    shape: "rectangle",
                },
            },
            {
                selector: "[type='register-value']",
                style: {
                    backgroundColor: "blue",
                },
            },
            {
                selector: "edge",
                style: {
                    width: 15,
                },
            },
        ]}
        elements={CytoscapeComponent.normalizeElements({
            nodes: nodes,
            edges: [],
        })}
    />;
}
