import {State} from "../../model/State";
import {UninitializedCell} from "../../model/UninitializedCell";
import {Stack} from "../../model/Stack";
import {PointerToStackCell} from "../../model/PointerToStackCell";
import {Delbtp} from "../../exec/instructions/Delbtp";

test("Instruction: POP", () => {
    const instr = new Delbtp();


    const prevState = State.new()
        .setStack(Stack.of(new UninitializedCell(), new UninitializedCell()));

    const expectedState = State.new()
        .setStack(Stack.of(new UninitializedCell()));


    expect(instr.step(prevState)).toStrictEqual(expectedState);
});