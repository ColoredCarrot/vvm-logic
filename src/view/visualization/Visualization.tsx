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
import {UninitializedCell} from "../../model/UninitializedCell";
import { ValueCell } from "../../model/ValueCell";
import {PointerToStackCell} from "../../model/PointerToStackCell";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {stat} from "fs";
import {Address} from "cluster";
import { AtomCell } from "../../model/AtomCell";
import {VariableCell} from "../../model/VariableCell";
import { StructCell } from "../../model/StructCell";

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

    // REGISTER
    const programmCounter = state.programCounter;
    nodes.push({
            data: {id: "PC", label: programmCounter, type: "register-value"},
            style: {label: programmCounter},
        });
    const framePointer = state.framePointer;
    nodes.push({
        data: {id: "FP", label: framePointer, type: "register-value"},
        style: {label: framePointer},
    });
    if (framePointer != -1){
        edges.push({
            data: {
                id: "FP",
                source: "FP",
                target: "S" + framePointer,
                type: "register-pointer",
            },
        });
    }
    const backtrackPointer = state.backtrackPointer;
    nodes.push({
        data: {id: "BP", label: backtrackPointer, type: "register-value"},
        style: {label: backtrackPointer},
    });
    if (backtrackPointer != -1){
        edges.push({
            data: {
                id: "BP",
                source: "BP",
                target: "S" + backtrackPointer,
                type: "register-pointer",
            },
        });
    }

    // STACK
    for (let i = 0; i < state.stack.size; ++i) {
        const stackCell = state.stack.get(i);

        if (stackCell instanceof UninitializedCell) {
            nodes.push({data: {id: "S" + i, label: "Stack[" + i +"]", type: "stack-uninitialized"}});
        }
        else if (stackCell instanceof ValueCell) {
            nodes.push({
                data: {id: "S" + i, label: "Stack[" + i +"]", type: "stack-value"},
                style: {label: stackCell.value}
            });
        }
        else if (stackCell instanceof PointerToStackCell) {
            nodes.push({data: {id: "S" + i, label: "Stack[" + i +"]", type: "stack-pointerToStack"}});
            edges.push({
                data: {
                    id: "SP" + i,
                    source: "S" + i,
                    target: "S" + stackCell.value,
                    type: "stack-pointerToStack",
                },
            });
        }
        else if (stackCell instanceof PointerToHeapCell) {
            nodes.push({data: {id: "S" + i, label: "Stack[" + i +"]", type: "stack-pointerToHeap"}});
            edges.push({
                data: {
                    id: "SP" + i,
                    source: "S" + i,
                    target: "H" + stackCell.value,
                    type: "stack-pointerToHeap",
                },
            });
        }
    }

    // HEAP
    for (let i = 0; i < state.heap.getHeapPointer(); ++i){

        // nur wenn an Heapadresse etwas steht!
        if (state.heap.get(i)){

            const heapCell = state.heap.get(i);

            if (heapCell instanceof UninitializedCell) {
                nodes.push({data: {id: "H" + i, label: "Heap[" + i +"]", type: "heap-uninitialized"}});
            }
            else if (heapCell instanceof AtomCell) {
                nodes.push({
                    data: {id: "H" + i, label: "Heap[" + i +"]", type: "heap-atom"},
                    style: {label: "A " + heapCell.value}
                });
            }
            else if (heapCell instanceof VariableCell) {
                nodes.push({
                    data: {id: "H" + i, label: "Heap[" + i +"]", type: "heap-variable"},
                    style: {label: heapCell.tag + " " + heapCell.value}
                });
                edges.push({
                    data: {
                        id: "HP" + i,
                        source: "H" + i,
                        target: "H" + heapCell.value,
                        type: "heap-pointerToHeap",
                    },
                });
            }
            else if (heapCell instanceof StructCell) {
                nodes.push({
                    data: {id: "H" + i, label: "Heap[" + i +"]", type: "heap-struct"},
                    style: {label: "S " + heapCell.label}
                });
            }
            else if (heapCell instanceof PointerToHeapCell) {
                nodes.push({data: {id: "H" + i, label: "Heap[" + i +"]", type: "heap-pointerToHeap"}});
                edges.push({
                    data: {
                        id: "HP" + i,
                        source: "H" + i,
                        target: "H" + heapCell.value,
                        type: "heap-pointerToHeap",
                    },
                });
            }
        }
        // sonst einfach weiter Heap durchgehen!
    }

    // TRAIL (if exists)
    for (let i = 0; i < state.trail.trailPointer; ++i) {
        nodes.push({
            data: {id: "T"+i, label: "Trail["+i+"]", type: "trail-value"},
            style: {label: state.trail.get(i)}
        })
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
