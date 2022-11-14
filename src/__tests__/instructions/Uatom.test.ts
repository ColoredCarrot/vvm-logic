import {UninitializedCell} from "../../model/UninitializedCell";
import {ValueCell} from "../../model/ValueCell";
import {Stack} from "../../model/Stack";
import {State} from "../../model/State";
import {Uatom} from "../../exec/instructions/Uatom";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {Heap} from "../../model/Heap";
import {VariableCell} from "../../model/VariableCell";
import {AtomCell} from "../../model/AtomCell";
import { Trail } from "../../model/Trail";

test("Instruction: UATOM", () => {
    const instr = new Uatom("a");

    // h = stack.get(stackPointer) --> switch heap.get(h):
    // case: heap.get(h) == AtomCell: break;
    // case: heap.get(h) == VariableCell: --> see testcase here
    // default: backtrack;

    const prevState = State.new()
        .setHeap(Heap.of(101, [100, new VariableCell(100)]))
        .setStack(Stack.of(
            new UninitializedCell(), new ValueCell(123), new UninitializedCell(),
            // h variable cell
            new PointerToHeapCell(100)))
        .setBacktrackPointer(3);

    const expectedState = State.new()
        .setHeap(Heap.of(102, [100, new VariableCell(101)], [101, new AtomCell("a")]))
        .setStack(Stack.of(
            // untouched stack
            new UninitializedCell(), new ValueCell(123), new UninitializedCell()))
        .setBacktrackPointer(3)
        .setTrail(Trail.of(100));

    expect(instr.step(prevState)).toStrictEqual(expectedState);
});