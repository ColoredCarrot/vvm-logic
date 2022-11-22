import Cytoscape from "cytoscape";
import cytoscape from "cytoscape";
import {ColaLayoutOptions, GapInequality} from "cytoscape-cola";
import cola from "cytoscape-cola";
import cytoscapeFcose from "cytoscape-fcose";
import React, {useContext, useEffect, useLayoutEffect, useRef} from "react";
import CytoscapeComponent from "react-cytoscapejs";
import {State} from "../../model/State";
import {STYLESHEET, TOTAL_NODE_HEIGHT} from "./NodeStyles";
import "./Visualization.scss";
import {createGraph, Graph} from "./VisualizationGraph";
import {Dialog} from "../../model/dialog/Dialog";
import {AppState, AppStateContext} from "../AppState";
import {StructCell} from "../../model/StructCell";
import {Range} from "immutable";
import {changeVmState} from "../util/Step";

Cytoscape.use(cola);

export function Visualization() {

    /////////////
    // Don't display heap cells whose address is >= heap pointer
    /////////////

    const [appState, setAppState] = useContext(AppStateContext);
    const state = appState.vmState.last() ?? State.new();

    return <div className="Visualization">
        <h3>Visualization</h3>

        <VisualizationGraph state={state}/>

        <div className={"Visualization__Modal" + (state.activeDialog !== null ? " Visualization__Modal--shown" : "")}>
            <div className="Visualization__Modal__Dialog">
                <div className="Visualization__Modal__Dialog__Content">
                    {state.activeDialog?.renderContent()}
                </div>
                <div className="Visualization__Modal__Dialog__Buttons">
                    {(state.activeDialog?.choices ?? [])?.map(choice =>
                        <ModalDialogButton
                            key={choice}
                            dialog={state.activeDialog!}
                            choice={choice}
                            appState={appState}
                            setAppState={setAppState}
                        />,
                    )}
                </div>
            </div>
        </div>
    </div>;
}

interface ModalDialogButtonProps<C extends readonly string[]> {
    dialog: Dialog<C>,
    choice: C[number],
    appState: AppState,

    setAppState(_: AppState): void,
}

function ModalDialogButton<C extends readonly string[]>({
    dialog,
    choice,
    appState,
    setAppState,
}: ModalDialogButtonProps<C>) {
    return <a
        className="Visualization__Modal__Dialog__Button"
        onClick={_ => {
            setAppState(changeVmState(appState, vmState => dialog.apply(choice, vmState.setActiveDialog(null))));
        }}
    >{choice}</a>;
}

function generateLayout(state: State, graph: Graph, cy?: cytoscape.Core): ColaLayoutOptions {
    cytoscape.use(cola);

    // The following is the display order of the registers:
    const regs = ["SP", "PC", "FP", "BP", "HP"]
        .filter(reg => graph.nodes.some(n => n.data.id === reg));

    const stackBottom = state.stack.size * TOTAL_NODE_HEIGHT;

    const addrsInStructs = state.heap.all().entrySeq()
        // For each struct on the heap...
        .filter(([_, cell]) => cell instanceof StructCell)
        // ...generate [struct addr, struct addr + 1, ..., struct addr + struct size]
        .map(([addr, cell]) =>
            Range(0, (cell as StructCell).size + 1)
                .map(off => addr + off)
                .toArray(),
        )
        .toArray();

    const gapInequalities: readonly GapInequality[] = cy === undefined ? [] : [
        ...state.heap.all().keySeq().toArray().map(address => ({
            axis: "x" as const,
            left: cy.$id("S0"),
            right: cy.$id("H" + address),
            gap: 1000,
        })),
    ];

    // All heap nodes are to the right of the stack
    const relPlacementConstraints: cytoscapeFcose.FcoseRelativePlacementConstraint[] = [
        ...state.heap.all().keySeq().toArray().map(address => ({
            left: "S0",
            right: "H" + address,
            gap: 1000,
        })),

        // // Within structs, cells should be ordered by address
        // ...addrsInStructs.flatMap(addrs =>
        //     addrs.slice(2).map((addr, i) => ({
        //         top: "H" + addrs[i + 1],
        //         bottom: "H" + addr,
        //         gap: TOTAL_NODE_HEIGHT,
        //     }))
        // ),
    ];

    const alignConstraints: cytoscapeFcose.FcoseAlignmentConstraint = {
        // @ts-expect-error: The type annotations for FcoseAlignmentConstraint are incorrect;
        //                   we need vertical: string[][] instead of [string, string][]
        vertical: [
            ...addrsInStructs.map(addrs => addrs.map(addr => "H" + addr)),
        ],
        horizontal: [],
    };

    return {
        name: "cola",
        animate: true,
        maxSimulationTime: 1000,
        refresh: 2,
        randomize: false,
        centerGraph: false,
        fit: true,
        nodeSpacing(node): number {
            return node.data("location") === "heap" ? 300 : 0;
        },
        edgeLength: 100,
        gapInequalities,
        avoidOverlap: true,
        // boundingBox: {x1: 0, y1: -100, w: 400, h: 400},
    };
}

interface VisualizationGraphProps {
    state: State,
}

function VisualizationGraph({state}: VisualizationGraphProps) {

    const cyRef = useRef<Cytoscape.Core>();

    const graph = createGraph(state);

    return <CytoscapeComponent
        cy={cy => {
            cyRef.current = cy;
            // cy.nodes("[location='heap']").layout(generateLayout(state, graph, undefined)).run();
            // cy.nodes("[location='heap']").layout(generateLayout(state, graph, cy)).run();
        }}
        className="Visualization__Cytoscape"
        stylesheet={STYLESHEET}
        elements={CytoscapeComponent.normalizeElements(graph)}
        layout={generateLayout(state, graph)}
        wheelSensitivity={0.3}
    />;
}
