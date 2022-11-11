import {UninitializedCell} from "../../model/UninitializedCell";
import {ValueCell} from "../../model/ValueCell";
import {Stack} from "../../model/Stack";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {Heap} from "../../model/Heap";
import {State} from "../../model/State";
import {Putref} from "../../exec/instructions/Putref";

test("Instruction: PUTREF", () => {
    const instr = new Putref(2);

    const prevState = State.new()
        .setHeap(Heap.of(101, [90, new UninitializedCell()]))
        .setStack(Stack.of(new UninitializedCell(), new ValueCell(123), new UninitializedCell(),
            new PointerToHeapCell(90), new UninitializedCell()))
        .setFramePointer(1);

    const expectedState = State.new()
        .setHeap(Heap.of(101, [90, new UninitializedCell()]))
        .setStack(Stack.of(
            // untouched stack
            new UninitializedCell(), new ValueCell(123), new UninitializedCell(),
            new PointerToHeapCell(90), new UninitializedCell(),
            // 1 concrete pointer to heap cell
            new PointerToHeapCell(90)
        ))
        .setFramePointer(1);

    expect(instr.step(prevState)).toStrictEqual(expectedState);
});
