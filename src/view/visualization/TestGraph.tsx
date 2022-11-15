import React from "react";
import {Canvas, CanvasPosition} from "reaflow";
import {UninitializedCell} from "../../model/UninitializedCell";

export const Register = () => (
    <Canvas
        width={1000}
        height={1000}
        maxHeight={1000}
        maxWidth={1000}
        fit={true}
        nodes={registerNodes}
        defaultPosition={CanvasPosition.LEFT}
        readonly={false}
        direction={"LEFT"}
        disabled={false}
    />
);

export const Stack = () => (
    <Canvas
        maxWidth={1000}
        maxHeight={500}
        nodes={stackNodes}
        defaultPosition={CanvasPosition.BOTTOM}
        readonly={true}
    />
);

export const MyDiagram = () => (
    <Canvas
        maxWidth={1000}
        maxHeight={500}
        edges={edges}
        defaultPosition={CanvasPosition.RIGHT}
        readonly={true}
    />
);

const registerNodes = [
    {
        id: "PC",
        text: "PC",
        x: 1,
        y: 1,
    },

    {
        id: "FP",
        text: "FP",
        width: 100,
        height: 60,
        x: 100000,
        y: 30002,
        rx: 23924,
        ry: 283183,
        offsetX: 1000000,
        offsetY: 5034038,
    },
];


const stackNodes = [
    {
        className: "UninitializedCell",
        id: "stack[0]",
        text: "",
        width: 100,
        height: 60,
        offsetX: 1,
        offsetY: 1,
    },
    {
        id: "stack[1]",
        text: "2",
        width: 100,
        height: 60,
    },
];

const edges = [
    {
        id: "1-2",
        from: "PC",
        to: "stack[1]",
    },
];
