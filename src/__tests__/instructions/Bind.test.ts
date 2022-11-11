import {UninitializedCell} from "../../model/UninitializedCell";
import {ValueCell} from "../../model/ValueCell";
import {Stack} from "../../model/Stack";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {Heap} from "../../model/Heap";
import {State} from "../../model/State";
import {Bind} from "../../exec/instructions/Bind";
import {VariableCell} from "../../model/VariableCell";
import {Trail} from "../../model/Trail";

test("Instruction: BIND", () => {
    const instr = new Bind();

    const prevState = State.new()
        .setHeap(Heap.of(100, [90, new VariableCell(90)], [91, new UninitializedCell()]))
        .setStack(Stack.of(new UninitializedCell(), new ValueCell(123), new UninitializedCell(),
            new PointerToHeapCell(90), new PointerToHeapCell(91)))
        .setBacktrackPointer(3)
        .setTrail(Trail.empty());


    const expectedState = State.new()
        .setHeap(Heap.of(100, [90, new VariableCell(91)], [91, new UninitializedCell()]))
        .setStack(Stack.of(
            // stack with two deleted cells
            new UninitializedCell(), new ValueCell(123), new UninitializedCell()))
        .setBacktrackPointer(3)
        .setTrail(Trail.of(90));

    expect(instr.step(prevState)).toStrictEqual(expectedState);
});
