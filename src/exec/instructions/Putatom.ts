import {Instruction} from "./Instruction";
import {State} from "../../model/State";

export class Putatom extends Instruction {

    atom : string;

    constructor(atom: string) {
        super("PUTATOM "+atom);
        this.atom = atom;
    }

    step(state: State): State {

        // lege Typ Atom mit Wert atom an neu allokierte Adresse im Heap
        // increase the HeapPointer um 1

        //state.stack.push(Adresse von Heap, wo atom liegt (ist Pointer zu Heap) )

        return state;
    }

}
