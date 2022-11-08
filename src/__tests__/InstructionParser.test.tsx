import {InstructionParser} from "../exec/InstructionParser";
import {Label} from "../exec/Label";


test('example with only label check for instructionparser', () => {
        let inputLines : string[];
        inputLines =
                [
                    "A: call B",
                    "B: call A",
                    "g/2: jump A",
                    "pop",
                    "unify"
                ];
        let expectedLabels : Label[] =
            [
                new Label(0, "A"),
                new Label(1, "B"),
                new Label(2, "g/2")
            ]


        let result = InstructionParser.parseInstructions(inputLines);
        let instructions = result.at(0)!;
        let labels = result.at(1)!;

        expect(labels).toStrictEqual(expectedLabels);
});

