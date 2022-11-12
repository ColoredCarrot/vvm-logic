import {UninitializedCell} from "../../model/UninitializedCell";
import {ValueCell} from "../../model/ValueCell";
import {Stack} from "../../model/Stack";
import {State} from "../../model/State";
import {Lastmark} from "../../exec/instructions/Lastmark";
import {PointerToStackCell} from "../../model/PointerToStackCell";

test("Instruction: LASTMARK", () => {
    const instr = new Lastmark();

    // if framePointer > BacktrackPointer: lastmark does nothing!
    // if framePointer <= BacktrackPointer: --> see testcase here

    const prevState = State.new()
        .setStack(Stack.of(
            // stack elements where FP and BP point
            new UninitializedCell(), new ValueCell(123), new UninitializedCell(),
            new PointerToStackCell(1), new ValueCell(42), new UninitializedCell(), new UninitializedCell()))
        .setFramePointer(4)
        .setBacktrackPointer(6);

    const expectedState = State.new()
        .setStack(Stack.of(
            // untouched stack elements where FP and BP point
            new UninitializedCell(), new ValueCell(123), new UninitializedCell(),
            new PointerToStackCell(1), new ValueCell(42), new UninitializedCell(), new UninitializedCell(),
            // new 6 stack elements
            new UninitializedCell(), new UninitializedCell(), new UninitializedCell(), new UninitializedCell(),
            new PointerToStackCell(4), new ValueCell(42)))
        .setFramePointer(4)
        .setBacktrackPointer(6);

    expect(instr.step(prevState)).toStrictEqual(expectedState);
});