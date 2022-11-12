import {UninitializedCell} from "../../model/UninitializedCell";
import {ValueCell} from "../../model/ValueCell";
import {Stack} from "../../model/Stack";
import {State} from "../../model/State";
import {Lastcall} from "../../exec/instructions/Lastcall";
import {SignLabel} from "../../exec/SignLabel";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";

test("Instruction: LASTCALL", () => {
    const instr = new Lastcall(new SignLabel(2, "p/2"), 1);

    // if framePointer <= BacktrackPointer: Call(2,"p/2")
    // if framePointer > BacktrackPointer: Slide(1, 2), Jump(2,"p/2") --> see testcase here

    const prevState = State.new()
        .setStack(Stack.of(
            // untouched stack elements where FP and BP point
            new UninitializedCell(), new ValueCell(123), new UninitializedCell(),
            // m old local cells
            new UninitializedCell(),
            // h argument cells
            new PointerToHeapCell(10), new PointerToHeapCell(20)))
        .setFramePointer(2)
        .setBacktrackPointer(1);

    const expectedState = State.new()
        .setStack(Stack.of(
            // untouched stack elements where FP and BP point
            new UninitializedCell(), new ValueCell(123), new UninitializedCell(),
            // h argument cells (with m old local cells deleted)
            new PointerToHeapCell(10), new PointerToHeapCell(20)))
        .setFramePointer(2)
        .setBacktrackPointer(1)
        .setProgramCounter(2);

    expect(instr.step(prevState)).toStrictEqual(expectedState);
});