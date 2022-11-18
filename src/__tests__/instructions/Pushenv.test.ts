import {State} from "../../model/State";
import {UninitializedCell} from "../../model/UninitializedCell";
import {Stack} from "../../model/Stack";
import {Pushenv} from "../../exec/instructions/Pushenv";

test("Instruction: PUSHENV", () => {
    const instr = new Pushenv(2);

    const prevState = State.new()
        .setStack(Stack.of(new UninitializedCell(), new UninitializedCell(), new UninitializedCell())).setFramePointer(1);

    const expectedState = State.new()
        .setStack(Stack.of(new UninitializedCell(), new UninitializedCell(), new UninitializedCell(), new UninitializedCell()))
        .setFramePointer(1);


    expect(instr.step(prevState)).toStrictEqual(expectedState);
});
