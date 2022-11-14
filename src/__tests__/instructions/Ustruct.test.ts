import {UninitializedCell} from "../../model/UninitializedCell";
import {ValueCell} from "../../model/ValueCell";
import {Stack} from "../../model/Stack";
import {State} from "../../model/State";
import {Ustruct} from "../../exec/instructions/Ustruct";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {Heap} from "../../model/Heap";
import {VariableCell} from "../../model/VariableCell";
import {AtomCell} from "../../model/AtomCell";
import { Trail } from "../../model/Trail";
import { SignLabel } from "../../exec/SignLabel";
import { Label } from "../../exec/Label";

test("Instruction: USTRUCT", () => {
    const instr = new Ustruct(new SignLabel(2, "f/2"), new Label(3, "A"));

    // h = stack.get(stackPointer) --> switch heap.get(h):
    // case: heap.get(h) == StructCell(new Label(2, "f/2"), n): break;
    // case: heap.get(h) == VariableCell: --> see testcase here
    // default: backtrack;

    const prevState = State.new()
        .setHeap(Heap.of(101, [100, new VariableCell(100)]))
        .setStack(Stack.of(
            new UninitializedCell(), new ValueCell(123), new UninitializedCell(),
            // h variable cell
            new PointerToHeapCell(100)));

    const expectedState = State.new()
        .setHeap(Heap.of(101, [100, new VariableCell(100)]))
        .setStack(Stack.of(
            // untouched stack
            new UninitializedCell(), new ValueCell(123), new UninitializedCell(),
            // h variable cell
            new PointerToHeapCell(100)))
        .setProgramCounter(3);

    expect(instr.step(prevState)).toStrictEqual(expectedState);
});