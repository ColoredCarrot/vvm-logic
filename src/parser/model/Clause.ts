import {Head} from "./Head";
import {Goal} from "./Goal";
import {types} from "sass";
import List = types.List;

export class Clause{

    head: Head;
    goals: Goal[];


    constructor(head: Head, goals: Goal[]) {
        this.head = head;
        this.goals = goals;
    }

}