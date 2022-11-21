import {State} from "../../model/State";
import {UninitializedCell} from "../../model/UninitializedCell";
import {Stack} from "../../model/Stack";
import {Popenv} from "../../exec/instructions/Popenv";
import {PointerToStackCell} from "../../model/PointerToStackCell";
import {ValueCell} from "../../model/ValueCell";

test("Instruction: POPENV", () => {
    const instr = new Popenv();

    const prevState = State.new()
        .setStack(Stack.of(
            new UninitializedCell(), new UninitializedCell(), new UninitializedCell(),
            new UninitializedCell(), new UninitializedCell(), new UninitializedCell(),
            new UninitializedCell(), new UninitializedCell(), new UninitializedCell(),
            new PointerToStackCell(3),
            new ValueCell(42),
            new UninitializedCell(),
        ))
        .setFramePointer(10)
        .setProgramCounter(12);

    const expectedState = State.new()
        .setStack(Stack.of(
            new UninitializedCell(), new UninitializedCell(), new UninitializedCell(),
            new UninitializedCell(), new UninitializedCell()
        ))
        .setFramePointer(3)
        .setProgramCounter(42);

    expect(instr.step(prevState)).toStrictEqual(expectedState);
});
