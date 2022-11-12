import {State} from "../../model/State";
import {UninitializedCell} from "../../model/UninitializedCell";
import {Stack} from "../../model/Stack";
import {PointerToStackCell} from "../../model/PointerToStackCell";
import {Delbtp} from "../../exec/instructions/Delbtp";

test("Instruction: DELBTP", () => {
    const instr = new Delbtp();


    const prevState = State.new()
        .setStack(Stack.of(new UninitializedCell(), new UninitializedCell(), new UninitializedCell(), new UninitializedCell(),
            new PointerToStackCell(2), new UninitializedCell(), new UninitializedCell(), new UninitializedCell(), new UninitializedCell(), new UninitializedCell()))
        .setFramePointer(8).setBacktrackPointer(8);

    const expectedState = State.new()
        .setStack(Stack.of(new UninitializedCell(), new UninitializedCell(), new UninitializedCell(), new UninitializedCell(),
            new PointerToStackCell(2), new UninitializedCell(), new UninitializedCell(), new UninitializedCell(), new UninitializedCell(), new UninitializedCell()))
        .setFramePointer(8).setBacktrackPointer(2);


    expect(instr.step(prevState)).toStrictEqual(expectedState);
});
