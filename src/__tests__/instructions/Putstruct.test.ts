import {UninitializedCell} from "../../model/UninitializedCell";
import {ValueCell} from "../../model/ValueCell";
import {Stack} from "../../model/Stack";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {Heap} from "../../model/Heap";
import {State} from "../../model/State";
import {Putstruct} from "../../exec/instructions/Putstruct";
import {SignLabel} from "../../exec/SignLabel";
import {StructCell} from "../../model/StructCell";


test("Instruction: PUTSTRUCT", () => {
    const instr = new Putstruct(new SignLabel(5, "f/2"));

    const prevState = State.new()
        .setHeap(Heap.of(101, [100, new UninitializedCell()]))
        .setStack(Stack.of(new UninitializedCell(), new ValueCell(123), new UninitializedCell(),
            new PointerToHeapCell(10), new PointerToHeapCell(20)));

    const expectedState = State.new()
        .setHeap(Heap.of(104,
            // untouched heap
            [100, new UninitializedCell()],
            // new struct cell + pointer to heap cells
            [101, new StructCell("f/2", 2)], [102, new PointerToHeapCell(10)], [103, new PointerToHeapCell(20)]))
        .setStack(Stack.of(
            // untouched stack
            new UninitializedCell(), new ValueCell(123), new UninitializedCell(),
            // 1 concrete pointer to heap cell, to begin of struct
            new PointerToHeapCell(101)
        ));

    expect(instr.step(prevState)).toStrictEqual(expectedState);
});
