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
};

export type NodeDefinition = cytoscape.NodeDefinition & {
    data: NodeDataDefinition,
};

type Edge = { from: NodeId, to: NodeId, type: EdgeType };

export type Graph = { nodes: NodeDefinition[], edges: EdgeDefinition[] };

export function createGraph(state: State): Graph {
    const nodes: (NodeDefinition & { pannable?: boolean })[] = [];
    const edges: Edge[] = [];

    // REGISTER
    const programCounter = state.programCounter;
    nodes.push({
        data: {id: "PC", label: "PC: " + programCounter, type: "register-value"},
    });
    const stackPointer = state.stack.stackPointer;
    nodes.push({
        data: {id: "SP", label: "SP: " + stackPointer, type: "register-value"},
    });
    const framePointer = state.framePointer;
    nodes.push({
        data: {id: "FP", label: "FP: " + framePointer, type: "register-value"},
    });
    if (framePointer != -1) {
        edges.push({
            from: "FP",
            to: {kind: "stack", index: framePointer},
            type: "registerToStack",
        });
    }
    const backtrackPointer = state.backtrackPointer;
    nodes.push({
        data: {id: "BP", label: "BP: " + backtrackPointer, type: "register-value"},
    });
    if (backtrackPointer != -1) {
        edges.push({
            from: "BP",
            to: {kind: "stack", index: backtrackPointer},
            type: "registerToStack",
        });
    }

    // STACK
    for (let i = 0; i < state.stack.size; ++i) {
        const stackCell = state.stack.get(i);

        if (stackCell instanceof UninitializedCell) {
            nodes.push({
                data: {id: "S" + i, label: "S[" + i + "]", type: "stack-uninitialized"},
                grabbable: false,
                pannable: true,
            });
        } else if (stackCell instanceof ValueCell) {
            nodes.push({
                data: {id: "S" + i, label: stackCell.value, type: "stack-value"},
                grabbable: false,
                pannable: true,
            });
        } else if (stackCell instanceof PointerToStackCell) {
            nodes.push({
                data: {id: "S" + i, label: "[" + stackCell.value + "]", type: "stack-pointerToStack"},
                grabbable: false,
                pannable: true,
            });
            edges.push({
                from: {kind: "stack", index: i},
                to: {kind: "stack", index: stackCell.value},
                type: "inStack",
            });
        } else if (stackCell instanceof PointerToHeapCell) {
            nodes.push({
                data: {
                    id: "S" + i,
                    label: "[" + stackCell.value + "]",
                    type: "heap-pointerToHeap",
                },
                grabbable: false,
                pannable: true,
            });
            edges.push({
                from: {kind: "stack", index: i},
                to: {kind: "heap", address: stackCell.value},
                type: "stackToHeap",
            });
        } else if (stackCell instanceof StructCell) {
            nodes.push({
                data: {
                    id: "S" + i,
                    label: stackCell.label,
                    type: "stack-value",
                },
                grabbable: false,
                pannable: true,
            });
        } else if (stackCell instanceof AtomCell) {
            nodes.push({
                data: {
                    id: "S" + i,
                    label: stackCell.value,
                    type: "stack-value",
                },
                grabbable: false,
                pannable: true,
            });
        } else if (stackCell instanceof VariableCell) {
            nodes.push({
                data: {
                    id: "S" + i,
                    label: "R",
                    type: "stack-value",
                },
                grabbable: false,
                pannable: true,
            });
        } else {
            throw new ExecutionError("Unexpected Cell Type on Stack: " + JSON.stringify(stackCell));
        }
    }

    // HEAP
    for (const i of state.heap.getKeySet()) {
        const heapCell = state.heap.get(i);
        const parent = isPartOfStruct(state, i);
        if (heapCell instanceof UninitializedCell) {
            nodes.push({
                data: {id: "H" + i,
                    label: "H[" + i + "]",
                    type: "heap-uninitialized",
                    parent: parent},
            });
        } else if (heapCell instanceof AtomCell) {
            nodes.push({
                data: {id: "H" + i,
                    label: "A: " + heapCell.value,
                    type: "heap-atom",
                    parent: parent,
                },
            });
        } else if (heapCell instanceof VariableCell) {
            const isUnbounded = heapCell.value === i;
            nodes.push({
                data: {
                    id: "H" + i,
                    label: heapCell.tag + ": " + heapCell.value,
                    type: isUnbounded ? "heap-unbounded-variable" : "heap-variable",
                    parent: parent,
                },
            });
            edges.push({
                from: {kind: "heap", address: i},
                to: {kind: "heap", address: heapCell.value},
                type: isUnbounded ? "loopInHeap" : "inHeap",
            });
        } else if (heapCell instanceof StructCell) {
            nodes.push({
                data: {id: "H" + i, 
                    label: "S: " + heapCell.label, 
                    type: "heap-struct",
                    parent: parent,
                },
            });
            for (let j = 0; j < heapCell.size; j++) {
                edges.push({
                    from: {kind: "heap", address: i /*+ j*/},
                    to: {kind: "heap", address: i + j + 1},
                    type: "inHeap",
                });
            }
        } else if (heapCell instanceof PointerToHeapCell) {
            nodes.push({
                data: {id: "H" + i, 
                    label: "[" + heapCell.value + "]", 
                    type: "heap-pointerToHeap",
                    parent: parent,
                }});
            edges.push({
                from: {kind: "heap", address: i},
                to: {kind: "heap", address: heapCell.value},
                type: "inHeap",
            });
        } else {
            throw new ExecutionError("Unexpected Cell Type on Heap: " + JSON.stringify(heapCell));
        }
    }

    // TRAIL (if exists)
    for (let i = 0; i < state.trail.trailPointer; ++i) {
        nodes.push({
            data: {id: "T" + i, label: state.trail.get(i), type: "trail-value"},
            selectable: false,
        });
    }

    return {
        nodes: nodes,
        edges: edges
            .filter(e => nodeExists(e.from, state) && nodeExists(e.to, state))
            .map(e => ({
                data: {
                    // id: "E" + nodeIdToString(e.from) + nodeIdToString(e.to),
                    source: nodeIdToString(e.from),
                    target: nodeIdToString(e.to),
                    type: e.type,
                },
                selectable: false,
                pannable: true,
            })),
    };
}

export function isPartOfStruct(state: State, addr: number): string | undefined {
    let iter = addr - 1;
    const minHeap = state.heap.getKeySet().min();
    if (minHeap === undefined)
        return undefined;

    for (;iter >= minHeap; iter--) {
        const heapCell = state.heap.get(iter);
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
