import {State} from "../../model/State";
import {UninitializedCell} from "../../model/UninitializedCell";
import {ValueCell} from "../../model/ValueCell";
import {Stack} from "../../model/Stack";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {Putanon} from "../../exec/instructions/Putanon";
import {VariableCell} from "../../model/VariableCell";
import { Heap } from "../../model/Heap";

test("Instruction: PUTANON", () => {
    const instr = new Putanon();

    const prevState = State.new()
        .setHeap(Heap.of(101, [100, new UninitializedCell()]))
        .setStack(Stack.of(new UninitializedCell(), new ValueCell(123)))
        .setFramePointer(1);

    const expectedState = State.new()
        .setHeap(Heap.of(102,
            // untouched heap
            [100, new UninitializedCell()],
            // new variable cell
            [101, new VariableCell(101)]))
        .setStack(Stack.of(
            // untouched stack
            new UninitializedCell(), new ValueCell(123),
            // 1 concrete variable cell
            new PointerToHeapCell(101),
        ))
        .setFramePointer(1);

    expect(instr.step(prevState)).toStrictEqual(expectedState);
});
