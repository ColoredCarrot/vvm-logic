import {State} from "../../model/State";
import {UninitializedCell} from "../../model/UninitializedCell";
import {Stack} from "../../model/Stack";
import {Check} from "../../exec/instructions/Check";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";

test("Instruction: CHECK", () => {
    const instr = new Check(5);

    //TODO: Check verstehen und testen
    const prevState = State.new()
        .setStack(Stack.of(new UninitializedCell(), new UninitializedCell(), new UninitializedCell(),
            new PointerToHeapCell(22), new UninitializedCell(), new PointerToHeapCell(33)));


    const expectedState = State.new()
        .setStack(Stack.of(new UninitializedCell(), new UninitializedCell(), new UninitializedCell(),
            new PointerToHeapCell(22), new UninitializedCell(), new PointerToHeapCell(33)));

    expect(instr.step(prevState)).toStrictEqual(expectedState);
});
