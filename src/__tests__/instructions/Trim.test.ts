import {UninitializedCell} from "../../model/UninitializedCell";
import {Stack} from "../../model/Stack";
import {State} from "../../model/State";
import {Trim} from "../../exec/instructions/Trim";

test("Instruction: TRIM", () => {
    const instr = new Trim(1);

    //TO DO: Trail checken
    const prevState = State.new()
        .setStack(Stack.of(new UninitializedCell(), new UninitializedCell(), new UninitializedCell(), new UninitializedCell(),
            new UninitializedCell(), new UninitializedCell(), new UninitializedCell())).setFramePointer(1).setBacktrackPointer(0);


    const expectedState = State.new()
        .setStack(Stack.of(new UninitializedCell(), new UninitializedCell(), new UninitializedCell())).setFramePointer(1).setBacktrackPointer(0);


    expect(instr.step(prevState)).toStrictEqual(expectedState);
});
