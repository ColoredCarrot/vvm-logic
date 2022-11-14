import {UninitializedCell} from "../../model/UninitializedCell";
import {Stack} from "../../model/Stack";
import {State} from "../../model/State";
import {Try} from "../../exec/instructions/Try";
import {Label} from "../../exec/Label";
import {ValueCell} from "../../model/ValueCell";

test("Instruction: TRY", () => {
    const instr = new Try(new Label(4, "A"));

    const prevState = State.new()
        .setStack(Stack.of(new UninitializedCell(), new UninitializedCell(), new UninitializedCell(), new UninitializedCell(),
            new UninitializedCell(), new UninitializedCell(), new UninitializedCell(), new UninitializedCell(),
            new UninitializedCell())).setFramePointer(7).setProgramCounter(20);


    const expectedState = State.new()
        .setStack(Stack.of(new UninitializedCell(), new UninitializedCell(), new ValueCell(20), new UninitializedCell(),
            new UninitializedCell(), new UninitializedCell(), new UninitializedCell(), new UninitializedCell(),
            new UninitializedCell())).setFramePointer(7).setProgramCounter(4);

    expect(instr.step(prevState)).toStrictEqual(expectedState);
});
