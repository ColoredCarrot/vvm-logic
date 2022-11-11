import {UninitializedCell} from "../../model/UninitializedCell";
import {ValueCell} from "../../model/ValueCell";
import {Stack} from "../../model/Stack";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import { Heap } from "../../model/Heap";
import { State } from "../../model/State";
import {Putvar} from "../../exec/instructions/Putvar";
import { VariableCell } from "../../model/VariableCell";

test("Instruction: PUTVAR", () => {
    const instr = new Putvar(2);

    const prevState = State.new()
        .setHeap(Heap.of(101, [90, new UninitializedCell()]))
        .setStack(Stack.of(new UninitializedCell(), new ValueCell(123), new UninitializedCell(),
            new UninitializedCell(), new UninitializedCell()))
        .setFramePointer(1);

    const expectedState = State.new()
        .setHeap(Heap.of(102,
            // untouched heap
            [90, new UninitializedCell()],
            // new variable cell with reference to itself
            [101, new VariableCell(101)]))
        .setStack(Stack.of(
            // untouched stack
            new UninitializedCell(), new ValueCell(123), new UninitializedCell(),
            // changed cells to pointer to heap cell and added new reference to variable cell
            new PointerToHeapCell(101), new UninitializedCell(), new PointerToHeapCell(101)))
        .setFramePointer(1);

    expect(instr.step(prevState)).toStrictEqual(expectedState);
});