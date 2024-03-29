import cytoscape from "cytoscape";
import {getRainbowHexColor} from "./Rainbow";
import {EdgeType, NodeType} from "./VisualizationGraph";

export const NODE_WIDTH = 600;
export const NODE_HEIGHT = 100;
export const NODE_PADDING = 30;
export const NODE_BORDER = 8;
export const TOTAL_NODE_HEIGHT = NODE_HEIGHT + 2 * NODE_PADDING + NODE_BORDER; // border does NOT need to be doubled
export const TOTAL_NODE_WIDTH = NODE_WIDTH + 2 * NODE_PADDING + NODE_BORDER;

const rainbowEdges = true; // TODO make configurable/a setting

export const DEFAULT_EDGE_STYLE: cytoscape.Css.Edge = {
    width: 5,
    "curve-style": "bezier",
    "target-arrow-shape": "triangle",
    "target-arrow-fill": "filled",
    "arrow-scale": 4,
    // Base rainbow edges on edge target node, so edges pointing to the same node will have the same color
    "line-color": e => rainbowEdges ? getRainbowHexColor(e.data("target")) : "#ACACAC",
    "target-arrow-color": e => rainbowEdges ? getRainbowHexColor(e.data("target")) : "#ACACAC",
};

export const EDGE_STYLES: { [T in EdgeType]: cytoscape.Css.Edge } = {
    registerToStack: {
        "curve-style": "taxi",
        "taxi-direction": "horizontal",
        "taxi-turn": e => 500 - (0.8 * Math.abs(e.sourceEndpoint().y)),
        "source-endpoint": "90deg",
        "target-endpoint": "270deg",
        "line-color": "#a3a3a3",
        "target-arrow-color": "#a3a3a3",
    },
    inHeap: {
        "curve-style": "taxi",
        "taxi-direction": "vertical",
    },
    loopInHeap: {
        "curve-style": "bezier",
        "loop-direction": "45deg",
        "loop-sweep": "10deg",
        "source-endpoint": "100px " + (-TOTAL_NODE_HEIGHT / 2) + "px",
        "target-endpoint": (TOTAL_NODE_WIDTH / 2) + "px " + (-TOTAL_NODE_HEIGHT / 2) + "px",
        "control-point-step-size": 200,
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
        "line-color": rainbowEdges ? undefined : "#828282",
        "target-arrow-color": rainbowEdges ? undefined : "#828282",
    },
    stackToHeap: {
        "curve-style": "taxi",
        "taxi-direction": "horizontal",
        "source-endpoint": "90deg",
    },
};

export const DEFAULT_NODE_STYLE = {
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    backgroundColor: "#c388ff",
    color: "black",

    shape: "roundrectangle",
    "text-valign": "center",
    "font-size": NODE_HEIGHT,
    "font-family": "DIN Alternate",
    "font-style": "normal",
    "label": "data(label)",
    padding: NODE_PADDING,
    "border-width": NODE_BORDER,
    "border-color": "#121212",
} as const;

export const NODE_STYLES: { [T in NodeType]: cytoscape.Css.Node } = {
    "heap-atom": {},
    "heap-pointerToHeap": {
        backgroundColor: "#3700b3",
        color: "white",
    },
    "heap-struct": {
        "background-opacity": 0.3,
        "text-valign": "bottom",
        color: "white",
    },
    "heap-uninitialized": {
        backgroundColor: "#03dac6",
    },
    "heap-variable": {
        backgroundColor: "#5eaa50",
    },
    "heap-unbounded-variable": {
        backgroundColor: "#1E5128",
        color: "white",
    },
    "register-value": {
        backgroundColor: "#9cecec",
    },
    "stack-pointerToStack": {},
    "stack-uninitialized": {
        backgroundColor: "#a3a3a3",
        color: "white",
        label: "",
    },
    "stack-value": {
        backgroundColor: "#e7ab79",
    },
    "invisible": {
        visibility: "hidden",
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
