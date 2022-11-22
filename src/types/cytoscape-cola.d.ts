declare module "cytoscape-cola" {

    import cytoscape from "cytoscape";

    declare const cola: cytoscape.Ext;
    export default cola;

    type BoundingBox =
        | { x1: number, y1: number, x2: number, y2: number }
        | { x1: number, y1: number, w: number, h: number }
        ;

    export interface GapInequality {
        axis: "x" | "y";
        left: cytoscape.EdgeSingular,
        right: cytoscape.EdgeSingular,
        gap: number,
    }

    interface ColaSpecificLayoutOptions {
        animate: boolean;
        refresh: number;
        maxSimulationTime: number;
        ungrabifyWhileSimulating: boolean;
        fit: boolean;
        padding: number;
        boundingBox: BoundingBox;
        nodeDimensionsIncludeLabels: boolean;

        // positioning options
        randomize: boolean;
        avoidOverlap: boolean;
        handleDisconnected: boolean;
        convergenceThreshold: number;
        nodeSpacing: (node: cytoscape.NodeSingular) => number;
        flow: { axis: "x" | "y", minSeparation: number } | undefined;
        alignment: undefined;
        gapInequalities: readonly GapInequality[];
        centerGraph: boolean;

        // different methods of specifying edge length
        edgeLength: number | ((edge: cytoscape.EdgeSingular) => number);
        edgeSymDiffLength: number | ((edge: cytoscape.EdgeSingular) => number);
        edgeJaccardLength: number | ((edge: cytoscape.EdgeSingular) => number);

        // iterations of cola algorithm; uses default values on undefined
        unconstrIter: ColaLayoutOptions;
        userConstIter: ColaLayoutOptions;
        allConstIter: ColaLayoutOptions;
    }

    export interface ColaLayoutOptions extends cytoscape.BaseLayoutOptions, Partial<ColaSpecificLayoutOptions> {
        name: "cola";
    }
}
