import {State} from "../../model/State";
import {Jump} from "../../exec/instructions/Jump";
import {Label} from "../../exec/Label";

test("Instruction: JUMP", () => {
    const instr = new Jump(new Label(5, "B"));

    const prevState = State.new()
        .setProgramCounter(1);

    const expectedState = State.new()
        .setProgramCounter(5);

    expect(instr.step(prevState)).toStrictEqual(expectedState);
});
