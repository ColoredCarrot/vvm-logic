import {State} from "../../model/State";
import {UninitializedCell} from "../../model/UninitializedCell";
import {Stack} from "../../model/Stack";
import {Label} from "../../exec/Label";
import {Init} from "../../exec/instructions/Init";
import {Heap} from "../../model/Heap";
import {Trail} from "../../model/Trail";
import {ValueCell} from "../../model/ValueCell";

test("Instruction: INIT", () => {
    const instr = new Init(new Label(4, "A"));

    const prevState = State.new()
        .setStack(Stack.empty()).setFramePointer(-1).setBacktrackPointer(-1).setHeap(Heap.of(100)).
        setTrail(Trail.of().setTrailPointer(-1));

    const expectedState = State.new()
        .setStack(Stack.of(new ValueCell(4), new ValueCell(-1), new ValueCell(-1), new ValueCell(0),
            new UninitializedCell(), new UninitializedCell()))
        .setFramePointer(5).setBacktrackPointer(5).setHeap(Heap.of(100)).setTrail(Trail.of().setTrailPointer(-1));

    expect(instr.step(prevState)).toStrictEqual(expectedState);
});
