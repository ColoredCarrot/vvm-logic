import {Goal} from "./Goal";

export class Query {

    goals: Goal[];

    constructor(goals: Goal[]) {
        this.goals = goals;
    }

}
