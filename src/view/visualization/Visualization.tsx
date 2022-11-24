import Cytoscape from "cytoscape";
import cytoscape from "cytoscape";
import cytoscapeFcose from "cytoscape-fcose";
import fcose, {FcoseLayoutOptions} from "cytoscape-fcose";
import React, {useContext, useRef} from "react";
import CytoscapeComponent from "react-cytoscapejs";
import {State} from "../../model/State";
import {calculateInterval} from "../App";
import {STYLESHEET, TOTAL_NODE_HEIGHT} from "./NodeStyles";
import "./Visualization.scss";
import {createGraph, Graph} from "./VisualizationGraph";
import {Dialog} from "../../model/dialog/Dialog";
import {AppState, AppStateContext} from "../AppState";
import {StructCell} from "../../model/StructCell";
import {Range} from "immutable";
import {changeVmState} from "../util/Step";

Cytoscape.use(fcose);

export function Visualization() {

    /////////////
    // Don't display heap cells whose address is >= heap pointer
    /////////////

    const [appState, setAppState] = useContext(AppStateContext);
    const state = appState.vmState.last() ?? State.new();

    return <div className="Visualization">
        <h3>Visualization</h3>

        <VisualizationGraph state={state} appState={appState}/>

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
                        />
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
        // Stack Dummy:
        {
            nodeId: "S0_DUMMY",
            position: {x: 1400, y: -TOTAL_NODE_HEIGHT},
        },
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

interface VisualizationGraphProps {
    state: State,
    appState: AppState,
}

function VisualizationGraph({state, appState}: VisualizationGraphProps) {

    const cyRef = useRef<Cytoscape.Core>();

    const graph = createGraph(state);

    const layout = generateLayout(state, graph);
    if (appState.autoStepEnabled) {
        // Only use non-default animation speed if currently auto-stepping
        layout.animationDuration = calculateInterval(10, 2000, appState.autoStepSpeed);
    }

    return <CytoscapeComponent
        cy={cy => cyRef.current = cy}
        className="Visualization__Cytoscape"
        stylesheet={STYLESHEET}
        elements={CytoscapeComponent.normalizeElements(graph)}
        layout={layout}
        wheelSensitivity={0.3}
    />;
}
