import {Instruction} from "./Instruction";
import {State} from "../../model/State";

export class Putatom extends Instruction {

    atom : string;

    constructor(atom: string) {
        super("PUTATOM "+atom);
        this.atom = atom;
    }

    step(state: State): State {

        // lege Typ A, mit Wert atom auf den Heap an neu allokierte Adresse
        // increase the HeapPointer um 2
        //  HP(HP()+2); // increase HP

        //state.stack.push(Adresse von Heap, ist Pointer zu Heap)

        return state;
    }



}
