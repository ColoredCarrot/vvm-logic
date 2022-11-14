import {State} from "../../model/State";
import {UninitializedCell} from "../../model/UninitializedCell";
import {Stack} from "../../model/Stack";
import {PointerToStackCell} from "../../model/PointerToStackCell";
import {Prune} from "../../exec/instructions/Prune";
import {Fail} from "../../exec/instructions/Fail";

test("Instruction: FAIL", () => {
    const instr = new Fail();

    //TODO: backtrack testen

});
