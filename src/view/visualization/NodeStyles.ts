import cytoscape from "cytoscape";
import {EdgeType, NodeType} from "./VisualizationGraph";

export const DEFAULT_EDGE_STYLE: cytoscape.Css.Edge = {
    width: 5,
    "curve-style": "bezier",
    "target-arrow-shape": "triangle",
    "target-arrow-fill": "filled",
    "arrow-scale": 4,
    "line-color": "#ACACAC",
    "target-arrow-color": "#ACACAC",
};

export const EDGE_STYLES: { [T in EdgeType]: cytoscape.Css.Edge } = {
    registerToStack: {
        "curve-style": "taxi",
        "taxi-direction": "horizontal",
        "taxi-turn": e => 300 - (0.8 * Math.abs(e.sourceEndpoint().y)),
        "source-endpoint": "90deg",
        "target-endpoint": "270deg",
        "line-color": "#4A4A4A",
        "target-arrow-color": "#4A4A4A",
    },
    inHeap: {
        "curve-style": "taxi",
        "taxi-direction": "vertical",
    },
    inStack: {
        "curve-style": "unbundled-bezier",
        // To avoid placing arrows all on the same vertical line,
        // the distance between the left stack boundary and the highpoint of the arrow depends on
        // the vertical distance of the connected nodes; arrows that travel farther are placed higher.
        "control-point-distances": e => [400 + 0.4 * Math.abs(e.sourceEndpoint().y - e.targetEndpoint().y)],
        "control-point-weights": [0.5],
        "source-endpoint": "270deg",
        "target-endpoint": "270deg",
        "line-color": "#828282",
        "target-arrow-color": "#828282",
    },
    stackToHeap: {
        "curve-style": "taxi",
        "taxi-direction": "horizontal",
        "source-endpoint": "90deg",
    },
};

export const DEFAULT_NODE_STYLE = {
    width: 600,
    height: 100,
    backgroundColor: "cadetblue",

    shape: "roundrectangle",
    "text-valign": "center",
    "font-size": 100,
    "font-family": "DIN Alternate",
    "font-style": "normal",
    "label": "data(label)",
} as const;

export const NODE_STYLES: { [T in NodeType]: cytoscape.Css.Node } = {
    "heap-atom": {},
    "heap-pointerToHeap": {
        backgroundColor: "#0074D9",
    },
    "heap-struct": {},
    "heap-uninitialized": {
        backgroundColor: "#03dac6",
        //labelColor : "grey",
    },
    "heap-variable": {},
    "register-value": {},
    "stack-pointerToStack": {},
    "stack-uninitialized": {
        backgroundColor: "#03dac6",
    },
    "stack-value": {
        backgroundColor: "#ecbfb0",
    },
    "trail-value": {},
};

export const STYLESHEET: cytoscape.StylesheetStyle[] = [
    {
        selector: "node",
        style: DEFAULT_NODE_STYLE,
    },
    ...Object.entries(NODE_STYLES).map(([nodeType, nodeStyle]) => ({
        selector: "node[type='" + nodeType + "']",
        style: nodeStyle,
    })),

    {
        selector: "edge",
        style: DEFAULT_EDGE_STYLE,
    },
    ...Object.entries(EDGE_STYLES).map(([edgeType, edgeStyle]) => ({
        selector: "edge[type='" + edgeType + "']",
        style: edgeStyle,
    })),
];
