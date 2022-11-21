import {UninitializedCell} from "../../model/UninitializedCell";
import {ValueCell} from "../../model/ValueCell";
import {Stack} from "../../model/Stack";
import {State} from "../../model/State";
import {Ustruct} from "../../exec/instructions/Ustruct";
import {PointerToHeapCell} from "../../model/PointerToHeapCell";
import {Heap} from "../../model/Heap";
import {VariableCell} from "../../model/VariableCell";
import {SignLabel} from "../../exec/SignLabel";
import {Label} from "../../exec/Label";
import {InstructionParser} from "../../exec/InstructionParser";
import {InvalidInstruction} from "../../exec/instructions/InvalidInstruction";

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

test("Parse Ustruct", () => {
    const labels = [new Label(-1, "B"), new Label(5, "D"), new Label(5, "C")];

    const validInputs = [
        "ustruct [|]/2 B",
        "USTRUCT [|]/3 D",
        "usTruCt [|]/912837 C",
    ];

    const inValidInputs = [
        "ustruct []/2 A",
        "ustruct [|] 3 A",
        "ustruct [|]/zwei B",
        "ustruct [|]/ R",
    ];

    const valids = validInputs.map(value => {
        return InstructionParser.parseInstruction(value, labels);
    });

    const inValids = inValidInputs.map(value => {
        return InstructionParser.parseInstruction(value, labels);
    });

    for (const v of valids) {
        expect(v).toBeInstanceOf(Ustruct);
    }

    for (const i of inValids) {
        expect(i).toBeInstanceOf(InvalidInstruction);
    }
});
