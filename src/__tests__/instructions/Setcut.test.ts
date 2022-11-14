import {UninitializedCell} from "../../model/UninitializedCell";
import {Stack} from "../../model/Stack";
import {State} from "../../model/State";
import {PointerToStackCell} from "../../model/PointerToStackCell";
import {Setcut} from "../../exec/instructions/Setcut";

test("Instruction: SETCUT", () => {
    const instr = new Setcut();

    const prevState = State.new()
        .setStack(Stack.of(new UninitializedCell(), new UninitializedCell(), new UninitializedCell(),
            new UninitializedCell(), new UninitializedCell(), new UninitializedCell(), new UninitializedCell(),
            new UninitializedCell(), new UninitializedCell(), new UninitializedCell())).setFramePointer(8).setBacktrackPointer(1);

    const expectedState = State.new()
        .setStack(Stack.of(new UninitializedCell(), new UninitializedCell(), new UninitializedCell(),
            new UninitializedCell(), new PointerToStackCell(1), new UninitializedCell(), new UninitializedCell(),
            new UninitializedCell(), new UninitializedCell(), new UninitializedCell())).setFramePointer(8).setBacktrackPointer(1);

    expect(instr.step(prevState)).toStrictEqual(expectedState);
});
