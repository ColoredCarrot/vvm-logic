import {Anon} from "./model/Anon";
import {Application} from "./model/Application";
import {Atom} from "./model/Atom";
import {Term} from "./model/Term";
import {Variable} from "./model/Variable";
import {Literal} from "./model/Literal";
import {Goal} from "./model/Goal";
import {Unification} from "./model/Unification";
import {Clause} from "./model/Clause";
import {Query} from "./model/Query";
import {Program} from "./model/Program";
import {Predicate} from "./model/Predicate";


export class CodeGenerator {
    private labelCounter = 0;

    private code_A(term: Term, rho: Map<string, number>): string {


        switch (term.value.kind) {
        case "Atom":
            let atom = term.value as Atom;
            return `putatom ${atom.value}`;

        case "Variable":
            let variable = term.value as Variable;

            if (!rho.has(variable.name)) {
                const n = rho.size;
                rho.set(variable.name, n + 1)
                return "putvar " + rho.size;
            }else{
                return "putref " + rho.get(variable.name);
            }

        case "Anon":
            let anon = term.value as Anon;
            return "putanon";

        case "Application":
            let application = term.value as Application;

            let result: string[] = [];
            for (let term of application.terms) {
                result.push(this.code_A(term, rho));
            }

            let k = application.terms.length;

            return result.join("\n") + "\n" + `putstruct ${application.name}/${k}`;
        default:
            throw `Error while parsing: Unknown term kind: ${term.value.kind}`;
        }
    }

    private getNextLabel(): string {
        return "A" + (++this.labelCounter);
    }


    private code_G(goal: Goal, rho: Map<string, number>): string {
        switch (goal.value.kind) {
        case "Literal":

            let literal = goal.value as Literal;

            let result: string[] = [];
            for (let term of literal.terms) {
                result.push(this.code_A(term, rho));
            }

            let k = literal.terms.length;
            let label = this.getNextLabel();

            return "mark " + label + "\n" + result.join("\n") + "\n" + `call ${literal.name}/${k}` + "\n" + label + ":";


        case "Unification":

            let unification = goal.value as Unification;

            //unification.variable.name undefined :====0

            if(!rho.has(unification.variable.name)){

                rho.set(unification.variable.name, rho.size + 1);

                return "putvar " + rho.get(unification.variable.name) + "\n" + this.code_A(unification.term, rho) + "\n"
                    + "bind";

            }else{
                return "putref " + rho.get(unification.variable.name) + "\n" + this.code_A(unification.term, rho) + "\n"
                    + "unify";
            }

        default:
            throw `Error while parsing: Unknown goal kind: ${goal.value.kind}`;
        }
    }


    private code_C(clause: Clause, rho: Map<string, number>): string {

        let result: string[] = [];
        for (let goal of clause.goals) {
            result.push(this.code_G(goal, rho));
        }

        return `pushenv ` + rho.size + "\n" + result.join("\n") + "\n" + "popenv";

    }

    private code_P(clauses: Clause[], label: string, rho: Map<string, number>): string {

        if (clauses.length == 1) {
            return `${label}:\n` + this.code_C(clauses[0], rho);
        } else {

            let result1: string[] = [];
            let result2: string[] = [];

            for (let clause of clauses) {
                let label = this.getNextLabel();
                result1.push("try " + label);
                result2.push(label + ":");
                result2.push(this.code_C(clause, rho));
            }
            result1.pop();

            return `${label}:\n` +
                "setbtp\n" +
                result1.join("\n") + "\n" +
                "delbtp\n" +
                `jump ${label}\n` +
                result1.join("\n");
        }

    }


    public code_Program(program: Program) {

        //Rho Initialize:

        let rho: Map<string, number> = new Map();

        //Goals aufrufen

            let result1: string[] = [];
            for (let goal of program.query.goals) {
                console.log(result1.push(this.code_G(goal, rho)));
            }


        //Erstellung von Predicates

        /*
        let name: string = program.clauses[0].head.name;
        let number: string = program.clauses[0].head.variables.length.toString();
        let s1: string = "(" + name + "/" + number + ")";

        const mapClauses_: Map<string, Clause[]> = new Map([[s1, [program.clauses[0]]]]);

        for (let i = 1; i < program.clauses.length; i++) {

            name = program.clauses[i].head.name;
            number = program.clauses[i].head.variables.length.toString();
            let predicateNew: string = "(" + name + "/" + number + ")";

            name = program.clauses[i - 1].head.name;
            number = program.clauses[i - 1].head.variables.length.toString();
            let predicateOld: string = "(" + name + "/" + number + ")";

            if (predicateNew == predicateOld) {
                let list: Clause[] = mapClauses_.get(predicateOld) as Clause[];
                list.push(program.clauses[i]);
                mapClauses_.set(predicateOld, list);

            } else {
                console.log(mapClauses_.set(predicateNew, [program.clauses[i]]));
            }
        }
        */

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

        return "init A0\n" +
            `pushenv ${rho.size}\n` +
            result1.join("\n") + "\n" +
            `halt ${rho.size}\n` +
            "A0:\n" +
            "no\n" +
            result2.join("\n");
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
