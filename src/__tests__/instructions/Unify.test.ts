import {UninitializedCell} from "../../model/UninitializedCell";
import {ValueCell} from "../../model/ValueCell";
import {Stack} from "../../model/Stack";
import {State} from "../../model/State";
import {Unify} from "../../exec/instructions/Unify";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {Heap} from "../../model/Heap";
import {VariableCell} from "../../model/VariableCell";

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
