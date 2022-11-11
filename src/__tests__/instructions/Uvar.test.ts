import {UninitializedCell} from "../../model/UninitializedCell";
import {ValueCell} from "../../model/ValueCell";
import {Stack} from "../../model/Stack";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import { Heap } from "../../model/Heap";
import { State } from "../../model/State";
import {Uvar} from "../../exec/instructions/Uvar";

test("Instruction: UVAR", () => {
    const instr = new Uvar(2);

    const prevState = State.new()
        .setHeap(Heap.of(101, [90, new UninitializedCell()]))
        .setStack(Stack.of(new UninitializedCell(), new ValueCell(123), new UninitializedCell(),
            new UninitializedCell(), new UninitializedCell(), new PointerToHeapCell(90)))
        .setFramePointer(1);

    const expectedState = State.new()
        .setHeap(Heap.of(101, [90, new UninitializedCell()]))
        .setStack(Stack.of(
            // untouched stack
            new UninitializedCell(), new ValueCell(123), new UninitializedCell(),
            // changed cell to pointer to heap cell with reference to heap
            new PointerToHeapCell(90),
            // untouched stack
            new UninitializedCell()))
        .setFramePointer(1);

    expect(instr.step(prevState)).toStrictEqual(expectedState);
});