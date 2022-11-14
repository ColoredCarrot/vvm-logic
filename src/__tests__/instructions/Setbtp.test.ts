import {UninitializedCell} from "../../model/UninitializedCell";
import {Stack} from "../../model/Stack";
import {State} from "../../model/State";
import {PointerToStackCell} from "../../model/PointerToStackCell";
import {Heap} from "../../model/Heap";
import {ValueCell} from "../../model/ValueCell";
import {Setbtp} from "../../exec/instructions/Setbtp";
import {Trail} from "../../model/Trail";

test("Instruction: SETBTP", () => {
    const instr = new Setbtp();

    //TO DO: Trail checken
    const prevState = State.new()
        .setStack(Stack.of(new UninitializedCell(), new UninitializedCell(), new UninitializedCell(), new UninitializedCell(),
            new UninitializedCell(), new UninitializedCell(), new UninitializedCell(), new UninitializedCell(), new UninitializedCell(),
            new UninitializedCell(), new UninitializedCell())).setFramePointer(9).setBacktrackPointer(1)
        .setTrail(Trail.of(12, 33, 44, 44).setTrailPointer(1))
        .setHeap(Heap.of(33));


    const expectedState = State.new()
        .setStack(Stack.of(new UninitializedCell(), new UninitializedCell(), new UninitializedCell(), new UninitializedCell(),
            new UninitializedCell(), new PointerToStackCell(1), new ValueCell(1), new ValueCell(33), new UninitializedCell(),
            new UninitializedCell(), new UninitializedCell())).setFramePointer(9).setBacktrackPointer(9)
        .setTrail(Trail.of(12, 33, 44, 44).setTrailPointer(1))
        .setHeap(Heap.of(33));


    expect(instr.step(prevState)).toStrictEqual(expectedState);
});
