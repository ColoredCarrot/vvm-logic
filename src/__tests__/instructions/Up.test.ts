import {State} from "../../model/State";
import {Stack} from "../../model/Stack";
import {ValueCell} from "../../model/ValueCell";
import {Up} from "../../exec/instructions/Up";
import {Label} from "../../exec/Label";

test("Instruction: UP", () => {
    const instr = new Up(new Label(10, "A"));

    const prevState = State.new()
        .setStack(Stack.of(
            // Untouched:
            new ValueCell(100),
            new ValueCell(101),
            // To be removed:
            new ValueCell(102),
        ))
        .setProgramCounter(4);

    const expectedState = State.new()
        .setStack(Stack.of(
            // Untouched:
            new ValueCell(100),
            new ValueCell(101),
        ))
        .setProgramCounter(10);

    expect(instr.step(prevState)).toStrictEqual(expectedState);
});
