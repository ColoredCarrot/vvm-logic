import {Instruction} from "./Instruction";
import {State} from "../../model/State";
import {PointerToStackCell} from "../../model/PointerToStackCell";
import {UninitializedCell} from "../../model/UninitializedCell";
import {Cell} from "../../model/Cell";
import {ValueCell} from "../../model/ValueCell";

export class Mark extends Instruction {

    //Kellerahmen anlegen

    private adressB: number;
    private cell : Cell = new UninitializedCell();

    constructor(adress: number) {
        super("MARK");
        this.adressB = adress;

        this.cell = 0
    }

    // S[SP + 5] ← FP; S[SP + 6] ← B; SP ← SP + 6;

    step(state: State): State {
       for (let i = 0; i < 4; i++) {
           state.stack.push(this.cell);// 4 uninitialized cells
       }

       //todo backtrackpointer?? 
       let framePointerCell : Cell = new PointerToStackCell(state.getFramePointer());
       let adressBPointerCell : Cell = new ValueCell(this.adressB);
       state.stack.push(framePointerCell);  //push cell Frame Pointer
       state.stack.push(adressBPointerCell); // push cell mit value address

       return state;
    }

}