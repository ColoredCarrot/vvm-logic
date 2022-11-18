import cytoscape from "cytoscape";
import {EdgeType, NodeType} from "./VisualizationGraph";

export const DEFAULT_EDGE_STYLE: cytoscape.Css.Edge = {
    width: 5,
    "curve-style": "unbundled-bezier",
    "target-arrow-shape": "triangle",
    "target-arrow-fill": "filled",
    "arrow-scale": 4,
};

export const EDGE_STYLES: { [T in EdgeType]: cytoscape.Css.Edge } = {
    registerToStack: {
        "source-endpoint": "90deg",
        "target-endpoint": "270deg",
    },
    inHeap: {},
    inStack: {},
    stackToHeap: {
        "source-endpoint": "90deg",
        "target-endpoint": "270deg",
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
