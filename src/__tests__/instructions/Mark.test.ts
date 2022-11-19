import {State} from "../../model/State";
import {Mark} from "../../exec/instructions/Mark";
import {UninitializedCell} from "../../model/UninitializedCell";
import {ValueCell} from "../../model/ValueCell";
import {Stack} from "../../model/Stack";
import {PointerToStackCell} from "../../model/PointerToStackCell";
import {Label} from "../../exec/Label";

test("Instruction: MARK", () => {
    const instr = new Mark(new Label(4, "A"));

    const prevState = State.new()
        .setStack(Stack.of(new UninitializedCell(), new ValueCell(123)))
        .setFramePointer(10);

    const expectedState = State.new()
        .setStack(Stack.of(
            // untouched stack
            new UninitializedCell(), new ValueCell(123),
            // 4 new uninitialized cells
            new UninitializedCell(), new UninitializedCell(), new UninitializedCell(), new UninitializedCell(),
            // 2 more with concrete values
            new PointerToStackCell(10),
            new ValueCell(4, "PC"),
        ))
        .setFramePointer(10);

    expect(instr.step(prevState)).toStrictEqual(expectedState);
});
