import {State} from "../../model/State";
import {Stack} from "../../model/Stack";
import {ValueCell} from "../../model/ValueCell";
import {Son} from "../../exec/instructions/Son";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {Heap} from "../../model/Heap";
import {StructCell} from "../../model/StructCell";
import {VariableCell} from "../../model/VariableCell";

test("Instruction: SON", () => {
    const instr = new Son(3);

    // Heap should not change
    const theHeap = Heap.of(1050,
        // The Struct:
        [1005, new StructCell("f/4", 4)],
        [1006, new ValueCell(4)],
        [1007, new ValueCell(5)],
        [1008, new PointerToHeapCell(1020)],
        [1009, new ValueCell(7)],
        // Cell referenced by Struct:
        [1020, new VariableCell(1021)],
        // Cell referenced by the previous cell:
        [1021, new ValueCell(12345)],
    );

    const prevState = State.new()
        .setStack(Stack.of(
            // Untouched:
            new ValueCell(200),
            new ValueCell(201),
            new ValueCell(202),
            // Cell that points to Struct on heap:
            new PointerToHeapCell(1005),
        ))
        .setHeap(theHeap);

    const expectedState = State.new()
        .setStack(Stack.of(
            // Untouched:
            new ValueCell(200),
            new ValueCell(201),
            new ValueCell(202),
            // Cell that points to Struct on heap:
            new PointerToHeapCell(1005),
            // Dereferenced cell from Struct:
            new PointerToHeapCell(1021),
        ))
        .setHeap(theHeap);

    expect(instr.step(prevState)).toStrictEqual(expectedState);
});
