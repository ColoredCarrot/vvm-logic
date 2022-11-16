import React, {useLayoutEffect, useRef} from "react";
import {State} from "../../model/State";
import Cytoscape from "cytoscape";
import cytoscape from "cytoscape";
import Cola from "cytoscape-cola";
import Avsdf from "cytoscape-avsdf";
import CytoscapeComponent from "react-cytoscapejs";
import "./Visualization.scss";
import "springy/springy";
import fcose from "cytoscape-fcose";

Cytoscape.use(Cola);
Cytoscape.use(Avsdf);
Cytoscape.use(fcose);

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

        <VisualizationGraph state={state} prevState={prevState}/>
    </div>;
}

function generateLayout(state: State, cy: React.MutableRefObject<Cytoscape.Core | undefined>): cytoscape.LayoutOptions {
    //Try with cose
    /*
        cytoscape.use(fcose);
        let aConstr = JSO
        let stackVertAlignment = "[";
        for (let i = 0; i < state.stack.size; i++) {
            stackVertAlignment = stackVertAlignment + "\"s" + i + "\"";
        }

        stackVertAlignment = stackVertAlignment + "]";

        const alignmentConstraint = "{vertical: [" + stackVertAlignment + "]";
        const aConstr = JSON.parse(alignmentConstraint);
    */

    return {
        name: "fcose",
        // @ts-ignore
        animate: true,
        randomize: false,
        //alignment: {vertical: [["FP", "BP", "PC"]]},
    };
}

function VisualizationGraph({state}: VisualizationProps) {

    const cy = useRef<Cytoscape.Core>();

    useLayoutEffect(() => {
        //cy.current!.$id("s3").positions({x: 300, y: 300}).lock();
        cy.current!
            .layout(generateLayout(state, cy)).run();

        // cy.current!
        //     .elements("node[type = 'stack']")
        //     .layout({
        //         name: "preset", positions: function(nodeid): Position {
        //             return cy.current!.$id(nodeid)!.position();
        //         },
        //     })
        //     .run();
    });

    const nodes = [];
    const edges = [];

    const programmCounter = state.programCounter;
    nodes.push(
        {
            data: {id: "PC", label: programmCounter, type: "register-value"},
            style: {label: programmCounter},
        });
    const framePointer = state.framePointer;
    nodes.push({
        data: {id: "FP", label: framePointer, type: "register-value"},
        style: {label: framePointer},
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
            edges: edges,
        })}
    />;
}

function VisualizationGraphOld() {

    // @ts-ignore
    const graph: any = new Springy.Graph();

    graph.addNodes("Dennis", "Michael", "Jessica", "Timothy", "Barbara");
    graph.addNodes("Amphitryon", "Alcmene", "Iphicles", "Heracles");

    graph.addEdges(
        ["Dennis", "Michael", {color: "#00A0B0", label: "Foo bar"}],
        ["Michael", "Dennis", {color: "#6A4A3C"}],
        ["Michael", "Jessica", {color: "#CC333F"}],
        ["Jessica", "Barbara", {color: "#EB6841"}],
        ["Michael", "Timothy", {color: "#EDC951"}],
        ["Amphitryon", "Alcmene", {color: "#7DBE3C"}],
        ["Alcmene", "Amphitryon", {color: "#BE7D3C"}],
        ["Amphitryon", "Iphicles"],
        ["Amphitryon", "Heracles"],
        ["Barbara", "Timothy", {color: "#6A4A3C"}]
    );

    // @ts-ignore
    const layout: any = new Springy.Layout.ForceDirected(graph, 400, 400, 0.5);

    // @ts-ignore
    const renderer: any = new Springy.Renderer(
        layout,
        function clear(): void {
            console.log("clear");
        },
        function drawEdge(edge: any, p1: any, p2: any): void {
            console.log("edge", edge, p1, p2);
        },
        function drawNode(node: any, p: any): void {
            // draw a node
        }
    );

    renderer.start();

    return <></>;
}
