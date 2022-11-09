import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {Stack} from "../../model/Stack";
import {dia} from "jointjs";
import Cell = dia.Cell;
import {UninitializedCell} from "../../model/UninitializedCell";
import {Pointer} from "../../model/Pointer";

export class Mark extends Instruction {

    //Kellerahmen anlegen

    private adressB: number;
    private cell: UninitializedCell = new UninitializedCell();

    constructor(adress: number) {
        super("MARK");
        this.adressB = adress;
    }

    // S[SP + 5] ← FP; S[SP + 6] ← B; SP ← SP + 6;

    step(state: State): State {
       for (let i = 0; i < 4; i++) {
           state.stack.push(this.cell);// 4 uninitialized cells
       }

       //todo backtrackpointer?? 
       let framePointerCell : Pointer = new Pointer(state.framePointer);
       let adressBPointerCell : Pointer = new Pointer(this.adressB);
       state.stack.push(framePointerCell);  //push cell Frame Pointer
       state.stack.push(adressBPointerCell); // push cell mit value address

       return state;
    }

}