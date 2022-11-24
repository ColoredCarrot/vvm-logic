import {Entry} from "../../exec/instructions/Entry";
import {Label} from "../../exec/Label";
import {InstructionParser} from "../../exec/InstructionParser";
import {Instruction} from "../../exec/instructions/Instruction";

const validEntryStrings =  [
    "ENTRY app/3 R _L",
    "ENTRY app/3 Default _L",
    "ENTRY app/3 [|]/2 _L",
    "ENTRY app/3 [] _L",
    "ENTRY app/3 R _L",
    "ENTRY app/3 Default _L",
    "ENTRY app/3 [|]/2 _L",
    "ENTRY app/3 [] _L",
    "ENTRY istLuegner/2 R _L",
    "ENTRY istLuegner/2 Default _L",
    "ENTRY istLuegner/2 luegt _L",
    "ENTRY istLuegner/2 wahr _L",
    "ENTRY beideLuegen/3 R _L",
    "ENTRY beideLuegen/3 Default _L",
    "ENTRY beideLuegen/3 luegt _L",
    "ENTRY beideLuegen/3 wahr _L"];


test("Parse Entry Instruction", () => {

    const l: Label = new Label(5, "_L");
    
    const parsed: Instruction[] = validEntryStrings.map(value => {
        return InstructionParser.parseInstruction(value, [l]);
    });

    for (const parsedKey of parsed) {
        expect(parsedKey).toBeInstanceOf(Entry);
    }
});
