import {State} from "../../model/State";
import {UninitializedCell} from "../../model/UninitializedCell";
import {Stack} from "../../model/Stack";
import {PointerToStackCell} from "../../model/PointerToStackCell";
import {Prune} from "../../exec/instructions/Prune";

test("Instruction: PRUNE", () => {
    const instr = new Prune();

    const prevState = State.new()
        .setStack(Stack.of(new UninitializedCell(), new UninitializedCell(), new UninitializedCell(),
            new UninitializedCell(), new PointerToStackCell(1), new UninitializedCell(), new UninitializedCell(),
            new UninitializedCell(), new UninitializedCell(), new UninitializedCell())).setFramePointer(8).setBacktrackPointer(2);

    const expectedState = State.new()
        .setStack(Stack.of(new UninitializedCell(), new UninitializedCell(), new UninitializedCell(),
            new UninitializedCell(), new PointerToStackCell(1), new UninitializedCell(), new UninitializedCell(),
            new UninitializedCell(), new UninitializedCell(), new UninitializedCell())).setBacktrackPointer(1).setFramePointer(8);


    expect(instr.step(prevState)).toStrictEqual(expectedState);
});
