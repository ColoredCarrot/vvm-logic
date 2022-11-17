import React, {useLayoutEffect, useRef} from "react";
import {State} from "../../model/State";
import Cytoscape from "cytoscape";
import cytoscape from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";
import "./Visualization.scss";
import "springy/springy";
import fcose from "cytoscape-fcose";
import {UninitializedCell} from "../../model/UninitializedCell";
import {ValueCell} from "../../model/ValueCell";
import {PointerToStackCell} from "../../model/PointerToStackCell";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {AtomCell} from "../../model/AtomCell";
import {VariableCell} from "../../model/VariableCell";
import {StructCell} from "../../model/StructCell";

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
    cytoscape.use(fcose);

    const stack_x = 50;
    const stack_y_bottom = 0;
    const stack_y_step = 10;
    if (state.stack.size > 0) {
        for (let i = 0; i < state.stack.size; i++) {
            cy.current?.$id("S" + i).position({y: stack_y_bottom - i * stack_y_step, x: stack_x}).lock();
        }
    }

    const regs_x = 10;
    const regs_y_bottom = stack_y_bottom;
    const regs_y_step = stack_y_step;
    const registers = cy.current?.elements("[type='register-value']");
    if (registers) {
        registers.forEach((ele, i) => {
            ele.position({x: regs_x, y: regs_y_bottom - i * regs_y_step}).lock();
        });
    }


    //All heap nodes are right of the Stack
    let relPlHeapRightOfStack = "";
    if (state.heap.getKeySet().size > 0) {
        for (const h of state.heap.getKeySet()) {
            relPlHeapRightOfStack +=
                "{\"left\": \"S0\"," +
                "\"right\": \"H" + h + "\"," +
                "\"gap\": 30},";
        }
        relPlHeapRightOfStack = relPlHeapRightOfStack.substring(0, relPlHeapRightOfStack.length - 1);
    }

    const relPlacementCombined = "[" + relPlHeapRightOfStack + "]";

    const relPlacementJson = JSON.parse(relPlacementCombined);

    //const alignmentConstraints = "{\"vertical\": [" + registerVertAlignment + "]}";
    //const alignmentJson = JSON.parse(alignmentConstraints);

    return {
        name: "fcose",
        // @ts-ignore
        animate: true,
        randomize: false,
        // alignmentConstraint: alignmentJson,
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

    // REGISTER
    const programmCounter = state.programCounter;
    nodes.push({
        data: {id: "PC", label: programmCounter, type: "register-value"},
    });
    const framePointer = state.framePointer;
    nodes.push({
        data: {id: "FP", label: framePointer, type: "register-value"},
    });
    if (framePointer != -1) {
        edges.push({
            data: {
                id: "FP",
                source: "FP",
                target: "S" + framePointer,
            },
        });
    }
    const backtrackPointer = state.backtrackPointer;
    nodes.push({
        data: {id: "BP", label: backtrackPointer, type: "register-value"},
    });
    if (backtrackPointer != -1) {
        edges.push({
            data: {
                id: "BP",
                source: "BP",
                target: "S" + backtrackPointer,
            },
        });
    }

    // STACK
    for (let i = 0; i < state.stack.size; ++i) {
        const stackCell = state.stack.get(i);

        if (stackCell instanceof UninitializedCell) {
            nodes.push({data: {id: "S" + i, label: "S[" + i + "]", type: "stack-uninitialized"}});
        }
        else if (stackCell instanceof ValueCell) {
            nodes.push({
                data: {id: "S" + i, label: stackCell.value, type: "stack-value"},
            });
        }
        else if (stackCell instanceof PointerToStackCell) {
            nodes.push({data: {id: "S" + i, label: "[" + stackCell.value + "]", type: "stack-pointerToStack"}});
            edges.push({
                data: {
                    id: "SP" + i,
                    source: "S" + i,
                    target: "S" + stackCell.value,
                },
            });
        }
        else if (stackCell instanceof PointerToHeapCell) {
            nodes.push({
                data: {
                    id: "S" + i,
                    label: "[" + stackCell.value + "]",
                },
            });
            edges.push({
                data: {
                    id: "SP" + i,
                    source: "S" + i,
                    target: "H" + stackCell.value,
                },
            });
        }
    }

    for (const i of state.heap.getKeySet()) {
        if (state.heap.get(i)) {

            const heapCell = state.heap.get(i);

            if (heapCell instanceof UninitializedCell) {
                nodes.push({data: {id: ("H" + i), label: "H[" + i + "]", type: "heap-uninitialized"}});
            } else if (heapCell instanceof AtomCell) {
                nodes.push({
                    data: {id: ("H" + i), label: "A: " + heapCell.value, type: "heap-atom"},
                });
            }
            else if (heapCell instanceof VariableCell) {
                nodes.push({
                    data: {id: ("H" + i), label: heapCell.tag + ": " + heapCell.value, type: "heap-variable"},
                });
                edges.push({
                    data: {
                        id: "HP" + i,
                        source: "H" + i,
                        target: "H" + heapCell.value,
                    },
                });
            }
            else if (heapCell instanceof StructCell) {
                nodes.push({
                    data: {id: "H" + i, label: "S: " + heapCell.label, type: "heap-struct"},
                });
                for (let j = 0; j < heapCell.size; j++) {
                    edges.push({
                        data: {
                            id: "HP" + i,
                            source: "H" + (i + j),
                            target: "H" + (i + j + 1),
                        },
                    });
                }
            }
            else if (heapCell instanceof PointerToHeapCell) {
                nodes.push({
                    data: {id: "H" + i, label: "[" + heapCell.value + "]", type: "heap-pointerToHeap"},
                });
                edges.push({
                    data: {
                        id: "HP" + i,
                        source: "H" + i,
                        target: "H" + heapCell.value,
                    },
                });
            }
        }
    }

    // TRAIL (if exists)
    for (let i = 0; i < state.trail.trailPointer; ++i) {
        nodes.push({
            data: {id: "T" + i, label: state.trail.get(i), type: "trail-value"},
        });
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
                    width: 14,
                    height: 7,
                    shape: "rectangle",
                    "text-valign": "center",
                    "font-size": 5,
                    "label": "data(label)",
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
                    width: 0.5,
                    "curve-style": "unbundled-bezier",
                    "target-arrow-shape": "vee",
                    "target-arrow-fill": "filled",
                    "arrow-scale": 0.5,
                },
            },
        ]}
        elements={CytoscapeComponent.normalizeElements({
            nodes: nodes,
            edges: edges,
        })}
    />;
}
