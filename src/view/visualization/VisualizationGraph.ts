import cytoscape, {EdgeDefinition} from "cytoscape";
import {AtomCell} from "../../model/AtomCell";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {PointerToStackCell} from "../../model/PointerToStackCell";
import {State} from "../../model/State";
import {StructCell} from "../../model/StructCell";
import {UninitializedCell} from "../../model/UninitializedCell";
import {ValueCell} from "../../model/ValueCell";
import {VariableCell} from "../../model/VariableCell";
import {ExecutionError} from "../../exec/ExecutionError";
import {Heap} from "../../model/Heap";
import {TOTAL_NODE_HEIGHT} from "./NodeStyles";

export const NodeTypes = [
    "heap-uninitialized",
    "heap-pointerToHeap",
    "heap-atom",
    "heap-struct",
    "heap-variable",
    "heap-unbounded-variable",
    "register-value",
    "trail-value",
    "stack-uninitialized",
    "stack-value",
    "stack-pointerToStack",
    "invisible",
] as const;

export type NodeType = typeof NodeTypes[number];

export type NodeId =
    "PC" | "SP" | "FP" | "BP" |
    { kind: "stack", index: number } |
    { kind: "heap", address: number };

export const EdgeTypes = [
    "registerToStack",
    "stackToHeap",
    "inStack",
    "inHeap",
    "loopInHeap",
] as const;

export type EdgeType = typeof EdgeTypes[number];

function nodeIdToString(nodeId: NodeId): string {
    if (typeof nodeId === "string") {
        return nodeId;
    }
    switch (nodeId.kind) {
    case "stack":
        return "S" + nodeId.index;
    case "heap":
        return "H" + nodeId.address;
    }
}

function nodeExists(nodeId: NodeId, state: State): boolean {
    if (typeof nodeId === "string") {
        return true;
    }
    if (nodeId.kind === "stack") {
        return nodeId.index >= 0 && nodeId.index < state.stack.size;
    }
    return true;
}

export type NodeDataDefinition = cytoscape.NodeDataDefinition & {
    label: string | number,
    type: NodeType,
    location: "registers" | "stack" | "heap" | "trail",
};

export type NodeDefinition = cytoscape.NodeDefinition & {
    data: NodeDataDefinition,
};

type Edge = { from: NodeId, to: NodeId, type: EdgeType };

export type Graph = { nodes: NodeDefinition[], edges: EdgeDefinition[] };

export function createGraph(state: State): Graph {
    const nodes: (NodeDefinition & { pannable?: boolean })[] = [];
    const edges: Edge[] = [];

    // nodes.push({
    //     data: {id: "S0_DUMMY", label: "I SHOULD NOT BE VISIBLE", type: "invisible"},
    // });

    const stackBottom = state.stack.size * TOTAL_NODE_HEIGHT;

    // REGISTER
    const regs = [
        ["PC", state.programCounter],
        ["SP", state.stack.stackPointer],
        ["FP", state.framePointer],
        ["BP", state.backtrackPointer],
        ["TP", state.trail.trailPointer],
        ["HP", state.heap.heapPointer],
    ] as const;

    // const regs = allRegs.filter(([_, value]) => value >= 0);

    regs.forEach(([name, value], i) => {
        nodes.push({
            data: {id: name, label: name + ": " + value, type: "register-value", location: "registers"},
            position: {x: 0, y: -(i + 1) * TOTAL_NODE_HEIGHT},
            locked: true,
        });
    });

    if (state.framePointer !== -1) {
        edges.push({
            from: "FP",
            to: {kind: "stack", index: state.framePointer},
            type: "registerToStack",
        });
    }
    if (state.backtrackPointer !== -1) {
        edges.push({
            from: "BP",
            to: {kind: "stack", index: state.backtrackPointer},
            type: "registerToStack",
        });
    }

    // STACK
    for (let i = 0; i < state.stack.size; ++i) {
        const stackCell = state.stack.get(i);

        let label: string;
        let type: NodeType;
        if (stackCell instanceof UninitializedCell) {
            label = "S[" + i + "]";
            type = "stack-uninitialized";
        } else if (stackCell instanceof ValueCell) {
            label = stackCell.value.toString();
            type = "stack-value";
        } else if (stackCell instanceof PointerToStackCell) {
            label = "[" + stackCell.value + "]";
            type = "stack-pointerToStack";
            edges.push({
                from: {kind: "stack", index: i},
                to: {kind: "stack", index: stackCell.value},
                type: "inStack",
            });
        } else if (stackCell instanceof PointerToHeapCell) {
            label = "[" + stackCell.value + "]";
            type = "heap-pointerToHeap";
            edges.push({
                from: {kind: "stack", index: i},
                to: {kind: "heap", address: stackCell.value},
                type: "stackToHeap",
            });
        } else if (stackCell instanceof StructCell) {
            label = stackCell.label;
            type = "stack-value";
        } else if (stackCell instanceof AtomCell) {
            label = stackCell.value;
            type = "stack-value";
        } else if (stackCell instanceof VariableCell) {
            label = "R";
            type = "stack-value";
        } else {
            throw new ExecutionError("Unexpected Cell Type on Stack: " + JSON.stringify(stackCell));
        }

        nodes.push({
            data: {
                id: "S" + i,
                label,
                type,
                location: "stack",
            },
            grabbable: false,
            pannable: true,
            position: {
                x: 1400,
                y: -(i + 1) * TOTAL_NODE_HEIGHT,
            },
            locked: true,
        });
    }

    // HEAP
    for (const i of state.heap.getKeySet()) {
        const heapCell = state.heap.get(i);
        const parent = isPartOfStruct(state.heap, i);

        let label: string;
        let type: NodeType;

        if (heapCell instanceof UninitializedCell) {
            label = "H[" + i + "]";
            type = "heap-uninitialized";
        } else if (heapCell instanceof AtomCell) {
            label = "A: " + heapCell.value;
            type = "heap-atom";
        } else if (heapCell instanceof VariableCell) {
            const isUnbounded = heapCell.value === i;
            label = heapCell.tag + ": " + heapCell.value;
            type = isUnbounded ? "heap-unbounded-variable" : "heap-variable";
            edges.push({
                from: {kind: "heap", address: i},
                to: {kind: "heap", address: heapCell.value},
                type: isUnbounded ? "loopInHeap" : "inHeap",
            });
        } else if (heapCell instanceof StructCell) {
            label = "S: " + heapCell.label;
            type = "heap-struct";
            // for (let j = 0; j < heapCell.size; j++) {
            //     edges.push({
            //         from: {kind: "heap", address: i /*+ j*/},
            //         to: {kind: "heap", address: i + j + 1},
            //         type: "inHeap",
            //     });
            // }
        } else if (heapCell instanceof PointerToHeapCell) {
            label = "[" + heapCell.value + "]";
            type = "heap-pointerToHeap";
            edges.push({
                from: {kind: "heap", address: i},
                to: {kind: "heap", address: heapCell.value},
                type: "inHeap",
            });
        } else {
            throw new ExecutionError("Unexpected Cell Type on Heap: " + JSON.stringify(heapCell));
        }

        nodes.push({
            data: {
                id: "H" + i,
                label,
                type,
                parent,
                location: "heap",
            },
        });
    }

    // TRAIL (if exists)
    for (let i = 0; i < state.trail.trailPointer; ++i) {
        nodes.push({
            data: {id: "T" + i, label: state.trail.get(i), type: "trail-value", location: "trail"},
            selectable: false,
        });
    }

    return {
        nodes: nodes,
        edges: edges
            .filter(e => nodeExists(e.from, state) && nodeExists(e.to, state))
            .map(e => ({
                data: {
                    id: "E_" + nodeIdToString(e.from) + "_" + nodeIdToString(e.to),
                    source: nodeIdToString(e.from),
                    target: nodeIdToString(e.to),
                    type: e.type,
                },
                selectable: false,
                pannable: true,
            })),
    };
}

export function isPartOfStruct(heap: Heap, addr: number): string | undefined {
    let iter = addr - 1;
    const minHeap = heap.getKeySet().min();
    if (minHeap === undefined)
        return undefined;

    for (; iter >= minHeap; iter--) {
        const heapCell = heap.get(iter);
        if (heapCell instanceof StructCell) {
            if ((iter + heapCell.size) >= addr) {
                return "H" + iter;
            } else {
                return undefined;
            }
        }
    }

    return undefined;
}
