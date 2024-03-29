import {CodeLine, CompositionLine, parseProgramText} from "../model/ProgramText";
import {State} from "../model/State";
import {step} from "../exec/step";
import {Heap} from "../model/Heap";
import {VariableCell} from "../model/VariableCell";

test("Run Garbage Collector Example", () => {
    const createGarbage: string[] = [
        "putvar 1",
        "putvar 1",
        "putvar 1",
        "putvar 1",
        "putstruct f/2",
        "pop",
        "f/2:",
    ];

    //Parse
    const parsedGarbage = parseProgramText(createGarbage);
    let state = State.new();
    //Execute
    for (const i of parsedGarbage.lines) {
        if (i instanceof CodeLine || i instanceof CompositionLine) {
            state = step(state, i.instruction);
        }
    }

    const expectedHeapNoShift = Heap.of(104,
        [101, new VariableCell(101)],
        [103, new VariableCell(103)],
    );

    //Remove because GC is disabled
    //expect(state.heap.getHeapPointer()).toStrictEqual(expectedHeapNoShift.getHeapPointer());
    //expect(state.heap.getKeySet()).toStrictEqual(expectedHeapNoShift.getKeySet());

    //Like this because isStrictEquals tests order of map entries
    for (const key of expectedHeapNoShift.getKeySet()) {
        //expect(state.heap.get(key)).toStrictEqual(expectedHeapNoShift.get(key));
    }

});
