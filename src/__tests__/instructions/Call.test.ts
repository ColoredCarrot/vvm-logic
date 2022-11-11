import {UninitializedCell} from "../../model/UninitializedCell";
import {ValueCell} from "../../model/ValueCell";
import {Stack} from "../../model/Stack";
import {State} from "../../model/State";
import {Call} from "../../exec/instructions/Call";
import {SignLabel} from "../../exec/SignLabel";

test("Instruction: CALL", () => {
    const instr = new Call(new SignLabel(2, "p/2"));

    const prevState = State.new()
        .setStack(Stack.of(new UninitializedCell(), new ValueCell(123), new UninitializedCell(), new UninitializedCell()));

    const expectedState = State.new()
        .setStack(Stack.of(new UninitializedCell(), new ValueCell(123), new UninitializedCell(), new UninitializedCell()))
        .setFramePointer(1)
        .setProgramCounter(2);

    expect(instr.step(prevState)).toStrictEqual(expectedState);
});
