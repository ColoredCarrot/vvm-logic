import {UninitializedCell} from "../../model/UninitializedCell";
import {ValueCell} from "../../model/ValueCell";
import {Stack} from "../../model/Stack";
import {State} from "../../model/State";
import {Unify} from "../../exec/instructions/Unify";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {Heap} from "../../model/Heap";
import {VariableCell} from "../../model/VariableCell";
import {AtomCell} from "../../model/AtomCell";
import {StructCell} from "../../model/StructCell";
import {Instruction} from "../../exec/instructions/Instruction";
import {Init} from "../../exec/instructions/Init";
import {Setbtp} from "../../exec/instructions/Setbtp";
import {Label} from "../../exec/Label";

test("Instruction: UNIFY", () => {
    const instr = new Unify();

    // unify(stack.get(stackPointer-1), stack.get(stackPointer))
    // stack.pop(2)

    const prevState = State.new()
        .setHeap(Heap.of(101, [99, new VariableCell(99)], [99, new VariableCell(99)]))
        .setStack(Stack.of(
            new UninitializedCell(), new ValueCell(123), new UninitializedCell(),
            // cells to unify
            new PointerToHeapCell(99), new PointerToHeapCell(99)));

    const expectedState = State.new()
        .setHeap(Heap.of(101, [99, new VariableCell(99)], [99, new VariableCell(99)]))
        .setStack(Stack.of(
            // untouched stack
            new UninitializedCell(), new ValueCell(123), new UninitializedCell()));

    expect(instr.step(prevState)).toStrictEqual(expectedState);
});

test("Unify, p.124 Example", () => {
    let prevState = State.new();
    prevState = new Init(new Label(5, "N")).step(prevState);
    prevState = new Setbtp().step(prevState);

    prevState = prevState.setHeap(Heap.of(111,
        [100, new AtomCell("aAtom")],
        [101, new VariableCell(101)],
        [102, new VariableCell(101)],
        [103, new VariableCell(103)],
        [104, new VariableCell(104)],
        [105, new StructCell("f/2", 2)],
        [106, new PointerToHeapCell(100)],
        [107, new PointerToHeapCell(104)],
        [108, new StructCell("f/2", 2)],
        [109, new PointerToHeapCell(102)],
        [110, new PointerToHeapCell(103)]));

    let expectedHeap = Heap.of(111,
        [100, new AtomCell("aAtom")],
        [101, new VariableCell(100)],
        [102, new VariableCell(101)],
        [103, new VariableCell(103)],
        [104, new VariableCell(103)],
        [105, new StructCell("f/2", 2)],
        [106, new PointerToHeapCell(100)],
        [107, new PointerToHeapCell(104)],
        [108, new StructCell("f/2", 2)],
        [109, new PointerToHeapCell(102)],
        [110, new PointerToHeapCell(103)]);

    let actualHeap = Instruction.unify(prevState, 105, 108)[0].heap;

    expect(expectedHeap).toStrictEqual(actualHeap);
});

