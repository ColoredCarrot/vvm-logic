import {Anon} from "./model/Anon";
import {Application} from "./model/Application";
import {Atom} from "./model/Atom";
import {Term} from "./model/Term";
import {Variable} from "./model/Variable";
import {Literal} from "./model/Literal";
import {Goal} from "./model/Goal";
import {Unification} from "./model/Unification";
import {Clause} from "./model/Clause";
import {Program} from "./model/Program";


export class CodeGenerator {

    private labelCounter: number = 0;


    private code_A(term: Term, setArg: Set<string>, count: number,  rho: Map<string, number>): string {

        switch (term.value.kind) {

        case "Atom":

            let atom = term.value as Atom;
            return `putatom ${atom.value}`;

        case "Variable":

            let variable = term.value as Variable;

            if (setArg.has(variable.name)){

                if(!rho.has(variable.name)){
                    rho.set(variable.name, rho.size + 1);
                }
                return "putref " + rho.get(variable.name);

            }else {

                if(count > 0){
                    return "putref " + rho.get(variable.name);
                }else {
                    if(rho.has(variable.name)){
                        return "putvar " + rho.get(variable.name);
                    }else {
                        const n = rho.size;
                        rho.set(variable.name, n + 1)
                        return "putvar " + rho.size;
                    }
                }
            }

        case "Anon":

            return "putanon";

        case "Application":

            let application = term.value as Application;

            let result: string[] = [];
            for (let term of application.terms) {
                result.push(this.code_A(term, setArg, count, rho));
            }

            let k = application.terms.length

            return result.join("\n") + "\n" + `putstruct ${application.name}/${k}`;

        default:
            throw `Error while parsing: Unknown term kind: ${term.value.kind}`;
        }
    }



    private code_G(goal: Goal, setArg: Set<string>, count: number, rho: Map<string, number>): string {

        switch (goal.value.kind) {

        case "Literal":

            let literal = goal.value as Literal;

            let result: string[] = [];
            for (let term of literal.terms) {
                result.push(this.code_A(term, setArg, count,  rho));
            }

            let k = literal.terms.length;
            let label = this.getNextLabel();

            if(result.length == 0){
                return "mark " + label + "\n" + `call ${literal.name}/${k}` + "\n" + label + ":";
            }else{
                return "mark " + label + "\n" + result.join("\n") + "\n" + `call ${literal.name}/${k}` + "\n" + label + ":";
            }


        case "Unification":

            let unification = goal.value as Unification;

            if (setArg.has(unification.variable.name) ) {

                if(!rho.has(unification.variable.name)){
                    rho.set(unification.variable.name, rho.size + 1);
                }
                return "putref " + rho.get(unification.variable.name) + "\n" + this.code_A(unification.term, setArg, count, rho) + "\n"
                        + "unify";

            }else {

                if (count > 0) {

                    return "putref " + rho.get(unification.variable.name) + "\n" + this.code_A(unification.term, setArg, count, rho) + "\n"
                        + "unify";

                } else {

                    rho.set(unification.variable.name, rho.size + 1);
                    return "putvar " + rho.get(unification.variable.name) + "\n" + this.code_A(unification.term, setArg, count, rho) + "\n"
                        + "bind";
                }
            }

        default:
            throw `Error while parsing: Unknown goal kind: ${goal.value.kind}`;
        }
    }



    private code_C(clause: Clause, rho: Map<string, number>): string {

        let setArguments = new Set<string>;
        for(let variable of clause.head.variables){
            setArguments.add(variable.name);
        }

        let result: string[] = [];
        let count: number = 0;
        for (let goal of clause.goals) {
            result.push(this.code_G(goal, setArguments, count++, rho));
        }

        return `pushenv ` + rho.size + "\n" + result.join("\n") + "\n" + "popenv";

    }

    private code_P(clauses: Clause[], label: string, rho: Map<string, number>): string {

        if (clauses.length == 1) {
            return `${label}:\n` + this.code_C(clauses[0], rho);
        } else {

            let result1: string[] = [];
            let result2: string[] = [];
            let result3: string[] = [];

            for (let clause of clauses) {
                let labelNew = this.getNextLabel();
                result1.push("try " + labelNew);
                result3.push(labelNew);
                result2.push(labelNew + ":");
                result2.push(this.code_C(clause, rho));
            }

            let labelNew = result3.pop();

            result1.pop();

            return `${label}:\n` +
                "setbtp\n" +
                result1.join("\n") + "\n" +
                "delbtp\n" +
                `jump ${labelNew}\n` +
                result2.join("\n");

        }

    }


    public code_Program(program: Program) {

        //Rho Initialize:


        let rho: Map<string, number> = new Map();

        //Goals aufrufen


            let result1: string[] = [];
            for (let goal of program.query.goals) {
                let count: number = 0;
                console.log(result1.push(this.code_G(goal, new Set, count++, rho)));
            }

        let rhoBeforePred = rho.size;

        const map: Map<string, Clause[]> = new Map();
        for (let clause of program.clauses) {
            let name = clause.head.name;
            let k = clause.head.variables.length;
            let label = `${name}/${k}`;

            if (map.has(label)) {
                // @ts-ignore
                map.get(label).push(clause);
            } else {
                map.set(label, [clause]);
            }
        }

        let result2: string[] = [];
        for (let keys of map.keys()){
            result2.push(this.code_P(map.get(keys)!, keys, rho));
        }


        return "init A\n" +
            `pushenv ${rhoBeforePred}\n` +
            result1.join("\n") + "\n" +
            `halt ${rhoBeforePred}\n` +
            "A0:\n" +
            "no\n" +
            result2.join("\n");
  }


    private getNextLabel(): string {

        let label: string = "ABCDEFGHIJKLMNOPQRSTUVW";
        this.labelCounter ++;
        if(this.labelCounter > 24){
            this.labelCounter = -1;
            return label.charAt(this.labelCounter ++) + this.labelCounter;
        }

        return label.charAt(this.labelCounter);
    }



    // Optimierung

    /*
    private code_U(term: Term, rho: Map<string, number>): string {

        switch (term.value.kind) {

        case "Atom":
            let atom = term.value as Atom;
            return `uatom ${atom.value}`;

        case "Variable":
            let variable = term.value as Variable;

            //size = 0 abchecken?
            if (!rho.has(variable.name)) {
                return "uvar " + rho.get(variable.name);
            }

            if (rho.size == 1) {
                rho.clear();
                rho.set(variable.name, 1);
                return "";
            }

            rho.set(variable.name, rho.size + 1);

            return "uref " + rho.get(variable.name);

        case "Anon":
            let anon = term.value as Anon;
            return "pop";

        case "Application":
            let application = term.value as Application;

            let result: string[] = [];
            for (let term of application.terms) {
                result.push(this.code_U(term, rho));
            }

            let k = application.terms.length;

            return "";

        }
    }

     */
}
