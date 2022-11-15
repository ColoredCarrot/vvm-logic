import React, {useEffect, useLayoutEffect, useRef} from "react";
import {State} from "../../model/State";
import Cytoscape, {Position} from "cytoscape";
import Cola from "cytoscape-cola";
import Avsdf from "cytoscape-avsdf";
import CytoscapeComponent from "react-cytoscapejs";
import "./Visualization.scss";
import "springy/springy";

Cytoscape.use(Cola);
Cytoscape.use(Avsdf);

interface VisualizationProps {
    prevState: State;
    state: State;
}

export function Visualization({prevState, state}: VisualizationProps) {
    return <div className="Visualization">
        <h3>Visualization</h3>

        <VisualizationGraph state={state} prevState={prevState}/>
    </div>;
}


function VisualizationGraph({state}: VisualizationProps) {

    const cy = useRef<Cytoscape.Core>();

    useLayoutEffect(() => {
        //cy.current!.$id("s3").positions({x: 300, y: 300}).lock();
        cy.current!
            .elements("[type = 'heap']")
            .layout(
                {
                    name: "cola",
                    // @ts-ignore
                    animate: true,
                    randomize: false,
                }
            ).run();
        // cy.current!
        //     .elements("node[type = 'stack']")
        //     .layout({
        //         name: "preset", positions: function(nodeid): Position {
        //             return cy.current!.$id(nodeid)!.position();
        //         },
        //     })
        //     .run();
    });

    const a = [];
    const edges = [];
    for (let i = 0; i < state.stack.size; ++i) {
        const cell = state.stack.get(i);

        if (i < 5) {
            a.push({data: {id: "s" + i, label: "Node " + i, type: "stack"}, position: {x: 100, y: 100 * i}});
        } else {
            a.push({data: {id: "s" + i, label: "Node " + i, type: "heap"}});
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
        elements={CytoscapeComponent.normalizeElements({
            nodes: a,
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
