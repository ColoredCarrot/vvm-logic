
import {State} from "../../model/State";
import {Stack} from "../../model/Stack";
import {UninitializedCell} from "../../model/UninitializedCell";
import {ValueCell} from "../../model/ValueCell";
import {Heap} from "../../model/Heap";
import {Trail} from "../../model/Trail";
import {Instruction} from "../../exec/instructions/Instruction";

test("Instruction: Backtrack", () => {

  /* const prevState = State.new()
        .setStack(Stack.of(new UninitializedCell(), new ValueCell(5), new UninitializedCell(), new ValueCell(1),
            new ValueCell(20), new UninitializedCell(), new UninitializedCell(), new UninitializedCell()))
        .setBacktrackPointer(6)
        .setTrail(Trail.of(1, 2 ,3).setTrailPointer(2))
        .setHeap(Heap.of(2));



    const expectedState = State.new()
        .setStack(Stack.of(new UninitializedCell(), new ValueCell(5), new UninitializedCell(), new ValueCell(8),
            new ValueCell(2), new UninitializedCell(), new UninitializedCell(), new UninitializedCell()))
        .setTrail(Trail.of(1, 2).setTrailPointer(1))
        .setFramePointer(6).setBacktrackPointer(6)
        .setHeap(Heap.of(20))
        .setProgramCounter(5);

    expect(Instruction.backtrack(prevState)).toStrictEqual(expectedState);


   */


});

