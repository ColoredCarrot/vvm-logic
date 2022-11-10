import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {SignLabel} from "../SignLabel";

export class Call extends Instruction {

    private sign: string;
    private size: number;
    private labelLine: number;

    /**
     *
     * @param label - SignLabel (only labels that look like f/2)
     */
    constructor(label: SignLabel) {
        super("CALL " + label.text);
        this.labelLine = label.line;
        this.sign = label.text;
        this.size = label.size;
    }

    step(state: State): State {

        //state.heap = state.heap.set(state.heap.get(state.stack.size - 2) + 1, state.heap.get(state.stack.size - 1))

        return state
            .modifyStack(stack => stack.pop(2))
            .modify(s => s.garbageCollector.run(s))
    }
}
