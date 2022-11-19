import {Entry} from "../../exec/instructions/Entry";
import {SignLabel} from "../../exec/SignLabel";
import {Label} from "../../exec/Label";
import {State} from "../../model/State";
import {VariableCell} from "../../model/VariableCell";
import {Index} from "../../exec/instructions/Index";

const EXPECT_JUMP_TO = -1;
const SIGN_INPUT = "f/2";
const DONT_CARE = -1;

function buildEntries(): Entry[] {
    const l0: SignLabel = new SignLabel(1, SIGN_INPUT);
    const l1: Label = new Label(EXPECT_JUMP_TO, "A");
    
    return [
        new Entry(l0, "R", l1),
        new Entry(l0, "f/2", l1),
    ];
}

test("TryChain Access", () => {
    const entries = buildEntries();
    
    let state = State.new();
    for (const entry of entries) {
        state = entry.step(state);
    }
    
    state = state.modifyStack(s => s.push(new VariableCell(5)));
    
    const index = new Index(new SignLabel(DONT_CARE, SIGN_INPUT));
    const stateActual = index.step(state);
    const stateExpected = state.modifyStack(s => s.pop()).setProgramCounter(EXPECT_JUMP_TO);
    
    expect(stateActual).toStrictEqual(stateExpected);
    
});
