import {State} from "../../model/State";
import {UninitializedCell} from "../../model/UninitializedCell";
import {Stack} from "../../model/Stack";
import {Pop} from "../../exec/instructions/Pop";

test("Instruction: POP", () => {
    const instr = new Pop();

    const prevState = State.new()
        .setStack(Stack.of(new UninitializedCell(), new UninitializedCell()));

    const expectedState = State.new()
        .setStack(Stack.of(new UninitializedCell()));


    expect(instr.step(prevState)).toStrictEqual(expectedState);
});