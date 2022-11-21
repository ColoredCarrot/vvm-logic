import Cytoscape from "cytoscape";
import cytoscape from "cytoscape";
import cytoscapeFcose from "cytoscape-fcose";
import fcose, {FcoseLayoutOptions} from "cytoscape-fcose";
import React, {useContext, useRef} from "react";
import CytoscapeComponent from "react-cytoscapejs";
import {State} from "../../model/State";
import {STYLESHEET, TOTAL_NODE_HEIGHT} from "./NodeStyles";
import "./Visualization.scss";
import {createGraph, Graph} from "./VisualizationGraph";
import {Dialog} from "../../model/dialog/Dialog";
import {AppState, AppStateContext} from "../AppState";
import {ExecutionError} from "../../exec/ExecutionError";

Cytoscape.use(fcose);

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
                    {(state.activeDialog?.choices as readonly string[] ?? [])?.map(choice =>
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
        //key={choice}
        className="Visualization__Modal__Dialog__Button"
        onClick={_ => {
            const state = appState.vmState.last() ?? State.new();
            const prevState = state.setActiveDialog(null);
            try {
                setAppState({...appState, vmState: appState.vmState.push(dialog.apply(choice, prevState))});
            } catch (ex) {
                if (!(ex instanceof ExecutionError)) {
                    console.error("Internal error!", ex);
                }
                const message = ex instanceof Error ? ex.message : JSON.stringify(ex);
                setAppState({...appState, lastExecutionError: ex instanceof ExecutionError ? ex : message});
            }
        }}
    >{choice}</a>;
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
        // alignmentConstraint: alignConstraints,
        relativePlacementConstraint: relPlacementConstraints,
        fixedNodeConstraint: fixedConstraints,
        uniformNodeDimensions: true,
    };
}

interface VisualizationGraphProps {
    state: State,
}

function VisualizationGraph({state}: VisualizationGraphProps) {

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
