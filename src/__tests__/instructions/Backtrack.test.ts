
import {State} from "../../model/State";
import {Stack} from "../../model/Stack";
import {UninitializedCell} from "../../model/UninitializedCell";
import {ValueCell} from "../../model/ValueCell";
import {Heap} from "../../model/Heap";
import {Trail} from "../../model/Trail";
import {Instruction} from "../../exec/instructions/Instruction";
import {VariableCell} from "../../model/VariableCell";

test("Instruction: Backtrack", () => {

    const prevState = State.new()
        .setStack(Stack.of(new UninitializedCell(), new ValueCell(13), new UninitializedCell(), new ValueCell(17),
            new ValueCell(42), new UninitializedCell(), new UninitializedCell(), new UninitializedCell(), new UninitializedCell(),
            new UninitializedCell()))
        .setFramePointer(8).setBacktrackPointer(6)
        .setHeap(Heap.of(4, [1, new UninitializedCell()], [2, new UninitializedCell()],
            [3, new VariableCell(42)], [4, new VariableCell(4)]))
        .setTrail(Trail.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 3, 4).setTrailPointer(19));


    const expectedState = State.new()
        .setStack(Stack.of(new UninitializedCell(), new ValueCell(13), new UninitializedCell(), new ValueCell(17),
            new ValueCell(42), new UninitializedCell(), new UninitializedCell(), new UninitializedCell(), new UninitializedCell(),
            new UninitializedCell()))
        .setTrail(Trail.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9).setTrailPointer(17))
        .setFramePointer(6).setBacktrackPointer(6)
        .setHeap(Heap.of(42, [1, new UninitializedCell()], [2, new UninitializedCell()],
            [3, new VariableCell(3)], [4, new VariableCell(4)]))
        .setProgramCounter(13);


    expect(Instruction.backtrack(prevState)).toStrictEqual(expectedState);

});

