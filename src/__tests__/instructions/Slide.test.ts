import {State} from "../../model/State";
import {Stack} from "../../model/Stack";
import {ValueCell} from "../../model/ValueCell";
import {Slide} from "../../exec/instructions/Slide";

test("Instruction: SLIDE", () => {
    const instr = new Slide(4, 2);

    const prevState = State.new()
        .setStack(Stack.of(
            // Untouched, below FP:
            new ValueCell(100),
            new ValueCell(101),
            // Above FP:
            // Local variables:
            new ValueCell(200),
            new ValueCell(201),
            new ValueCell(202),
            new ValueCell(203),
            // To-be-moved:
            new ValueCell(300),
            new ValueCell(301),
        ))
        .setFramePointer(1);

    const expectedState = State.new()
        .setStack(Stack.of(
            // Untouched, below FP:
            new ValueCell(100),
            new ValueCell(101),
            // Above FP, just the moved cells remain:
            new ValueCell(300),
            new ValueCell(301),
        ))
        .setFramePointer(1);

    const actual = instr.step(prevState);
    expect(actual).toStrictEqual(expectedState);
});
