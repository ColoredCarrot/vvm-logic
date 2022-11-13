import {InstructionParser} from "../../exec/InstructionParser";
import {Entry} from "../../exec/instructions/Entry";
import {SignLabel} from "../../exec/SignLabel";
import {Index} from "../../exec/instructions/Index";
import {Getnode} from "../../exec/instructions/Getnode";

test("parse Instructions", () => {
    const validIndex = "index q/2";
    const label: SignLabel = new SignLabel(0, "q/2");
    const indexExpected = new Index(label);
    const validGetNode: string[] = ["getnode", "getNode", "GETNODE"];
    const validEntry = "ENTRY q/2 default 3";
    const entryExpected = new Entry(label, "default", 3);

    const act = (validGetNode.concat([validIndex, validEntry])).map(v => {
        return InstructionParser.parseInstruction(v, [label]);
    });

    const expectedInstr = [new Getnode(), new Getnode(), new Getnode(), indexExpected, entryExpected];

    expect(act).toEqual(expectedInstr);
});
