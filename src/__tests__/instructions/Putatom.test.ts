import {UninitializedCell} from "../../model/UninitializedCell";
import {ValueCell} from "../../model/ValueCell";
import {Stack} from "../../model/Stack";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import { Heap } from "../../model/Heap";
import { Putatom } from "../../exec/instructions/Putatom";
import {AtomCell} from "../../model/AtomCell";
import { State } from "../../model/State";

test("Instruction: PUTATOM", () => {
    const instr = new Putatom("a");

    const prevState = State.new()
        .setHeap(Heap.of(101, [100, new UninitializedCell()]))
        .setStack(Stack.of(new UninitializedCell(), new ValueCell(123)))
        .setFramePointer(1);

    const expectedState = State.new()
        .setHeap(Heap.of(102,
            // existing cell on heap
            [100, new UninitializedCell()],
            // new atom cell
            [101, new AtomCell("a")]))
        .setStack(Stack.of(
            // untouched stack
            new UninitializedCell(), new ValueCell(123),
            // 1 concrete variable cell
            new PointerToHeapCell(101),
        ))
        .setFramePointer(1);

    expect(instr.step(prevState)).toStrictEqual(expectedState);
});