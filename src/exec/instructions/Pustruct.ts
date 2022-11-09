import {Instruction} from "./Instruction";
import {State} from "../../model/State";

export class Putstruct extends Instruction {

    structName : string;
    size : number;

    constructor(structName: string) {
        super("PUTSTRUCT "+structName);
        this.structName = structName;
        this.size = +structName.substring(structName.indexOf("/")+1)
    }

    step(state: State): State {

        let stackPointer = state.stack.values.length - ( this.size + 1 )

        // allokiere this.size + 1 Platz auf dem Heap
        // lege Typ Struct mit Wert this.structName auf Heap

        for (let i = 0; i < this.size; i++) {
            // lege auf Heap das Element von stage.stack.get(stackPointer+i)
        }

        for (let i = 0; i < this.size; i++) {
            // danach entferne size Elemente von Stack
            state.stack.pop();
        }

        return state;
    }

}