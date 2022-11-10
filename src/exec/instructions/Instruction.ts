import {State} from "../../model/State";

export abstract class Instruction {
    protected constructor(public instruction: string) {}

    abstract step(state: State): State;

    public static unify(state: State, u: number, v: number): boolean {
        return false;
    }

    public static trail(state: State, u: number): void {
        //TODO
    }

    public static backtrack(state: State): void {
        //TODO
    }

    public static reset(state: State, x: number, y: number): void {
        //TODO
    }

    public static check(state: State, u: number, v: number): boolean {
        return false;
    }

    public static deref(state: State, v: number): number {
        return 0;
    }
}
