import React, {useLayoutEffect, useRef} from "react";
import {State} from "../../model/State";
import Cytoscape from "cytoscape";
import cytoscape from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";
import "./Visualization.scss";
import fcose, {FcoseLayoutOptions} from "cytoscape-fcose";
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

function generateLayout(state: State, cy: React.MutableRefObject<Cytoscape.Core | undefined>): FcoseLayoutOptions {
    cytoscape.use(fcose);

    const stack_x = 20;
    const stack_y_bottom = 0;
    const stack_y_step = 10;
    if (state.stack.size > 0) {
        for (let i = 0; i < state.stack.size; i++) {
            cy.current?.$id("S" + i).position({y: stack_y_bottom - i * stack_y_step, x: stack_x}).lock();
        }
    }

    const trail_x = 50;
    const trail_y_bottom = 0;
    const trail_y_step = 10;
    console.log(state.trail.trailPointer);
    if (state.trail.trailPointer > 0) {
        for (let i = 0; i < state.trail.trailPointer; i++) {
            cy.current?.$id("T" + i).position({y: trail_y_bottom - i * trail_y_step, x: trail_x}).lock();
        }
    }

    const regs_x = -30;
    const regs_y_bottom = -50;
    const regs_y_step = stack_y_step;
    const registers = cy.current?.elements("[type='register-value']") ?? null;
    if (registers !== null) {
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
    const programCounter = state.programCounter;
    nodes.push({
        data: {id: "PC", label: programCounter, type: "register-value"},
    });
    const stackPointer = state.stack.stackPointer;
    nodes.push({
        data: {id: "SP", label: stackPointer, type: "register-value"},
    });
    const framePointer = state.framePointer;
    nodes.push({
        data: {id: "FP", label: framePointer, type: "register-value"},
    });
    if (framePointer !== -1) {
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
    if (backtrackPointer !== -1) {
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

    for (const [addr, heapCell] of state.heap) {
        if (heapCell instanceof UninitializedCell) {
            nodes.push({data: {id: ("H" + addr), label: "H[" + addr + "]", type: "heap-uninitialized"}});
        } else if (heapCell instanceof AtomCell) {
            nodes.push({
                data: {id: ("H" + addr), label: "A: " + heapCell.value, type: "heap-atom"},
            });
        } else if (heapCell instanceof VariableCell) {
            nodes.push({
                data: {id: ("H" + addr), label: heapCell.tag + ": " + heapCell.value, type: "heap-variable"},
            });
            edges.push({
                data: {
                    id: "HP" + addr,
                    source: "H" + addr,
                    target: "H" + heapCell.value,
                },
            });
        } else if (heapCell instanceof StructCell) {
            nodes.push({
                data: {id: "H" + addr, label: "S: " + heapCell.label, type: "heap-struct"},
            });
            for (let j = 0; j < heapCell.size; j++) {
                edges.push({
                    data: {
                        id: "HP" + addr,
                        source: "H" + (addr + j),
                        target: "H" + (addr + j + 1),
                    },
                });
            }
        } else if (heapCell instanceof PointerToHeapCell) {
            nodes.push({
                data: {id: "H" + addr, label: "[" + heapCell.value + "]", type: "heap-pointerToHeap"},
            });
            edges.push({
                data: {
                    id: "HP" + addr,
                    source: "H" + addr,
                    target: "H" + heapCell.value,
                },
            });
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
        style={{width: "100%", height: "100%", backgroundColor: "#b5e8e3"}}

        stylesheet={[


            {
                selector: "node",
                style: {
                    width: 30,
                    height: 10,
                    backgroundColor: "cadetblue",

                    shape: "roundrectangle",
                    "text-valign": "center",
                    "font-size": 6.5,
                    "font-family": "DIN Alternate",
                    "font-weight": 1,
                    "font-style": "normal",
                    "label": "data(label)",
                },
            },

            //register-cell:

            {
                selector: "[type='register-value']",
                style: {
                    backgroundColor: "#01695e",

                },
            },

            //stack-cells:

            {
                selector: "[type= 'stack-uninitialized']",
                style: {
                    backgroundColor: "#03dac6",
                    //labelColor : "grey",

                },
            },
            {
                selector: "[type= 'stack-pointerToStack']",
                style: {

                    backgroundColor: "#549254",

                },
            },

            {
                selector: "[type= 'stack-pointerToHeap']",
                style: {
                    backgroundColor: "#0074D9",

                },
            },

            {
                selector: "[type= 'stack-value']",
                style: {
                    backgroundColor: "#ecbfb0",

                },
            },

            //heap-cells:

            {
                selector: "[type= 'heap-uninitialized']",
                style: {

                },
            },

            {
                selector: "[type= 'heap-atom']",
                style: {


                },
            },

            {
                selector: "[type= 'heap-variable']",
                style: {

                },
            },

            {
                selector: "[type= 'heap-struct']",
                style: {

                },
            },

            {
                selector: "[type= 'heap-pointerToHeap']",
                style: {

                },
            },

            //trail-cell:

            {
                selector: "[type= 'trail-value']",
                style: {

                },
            },

            //edge

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
