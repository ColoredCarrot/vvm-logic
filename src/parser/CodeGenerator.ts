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

    private label: string = "A";

    private code_A(term: Term, rho: Map<string, number>): string {

        switch (term.value.kind) {
        case "Atom":
            let atom = term.value as Atom;
            return `putatom ${atom.value}`;

        case "Variable":
            let variable = term.value as Variable;

            //size = 0 abchecken?
            if (!rho.has(variable.name)) {
                return "putvar" + rho.get(variable.name);
            }

            if (rho.size == 1) {
                rho.clear();
                rho.set(variable.name, 1);
            }

            rho.set(variable.name, rho.size + 1);

            return "putref" + rho.get(variable.name);

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

    private labelGenerator(): void {

        this.label = this.label + 1 as string;

    }


    private code_G(goal: Goal, rho: Map<string, number>): string {
        switch (goal.value.kind) {
        case "Literal":

            let literal = goal.value as Literal;

            let result: string[] = [];
            for (let term of literal.terms) {
                result.push(this.code_A(term, rho));
            }

            this.labelGenerator();

            let k = literal.terms.length;

            return "mark " + this.label + "\n" + result.join("\n") + "\n" + `call ${literal.name}/${k}` + "\nB:\n";


        case "Unification":
            let unification = goal.value as Unification;

            //size = 0 abchecken?

            if(!rho.has(unification.variable.name)){
                if(rho.size == 1){
                    rho.clear();
                    rho.set(unification.variable.name, 1);
                }
                rho.set(unification.variable.name, rho.size + 1);

                return "putvar " + rho.size + "\n" + this.code_A(unification.term, rho) + "\n"
                    + "bind";

            }else {

                return "putref " + rho.get(unification.variable.name) + "\n" + this.code_A(unification.term, rho) + "\n"
                    + "unify";
            }

        default:
            throw `Error while parsing: Unknown goal kind: ${goal.value.kind}`;
        }
    }





    private code_U(unification: Unification, rho: Map<string, number>): string {
        //FIXME
        return "";
    }

    private code_C(clause: Clause, rho: Map<string, number>): string {

        let result: string[] = [];
        for (let goal of clause.goals) {
            result.push(this.code_G(goal, rho));
        }

        return `pushenv`+ rho.size + "\n" + result.join("\n") + "\n"+ "popenv";

    }

    private code_P(clauses: Clause[], label: string,  rho: Map<string, number>): string {

        if(clauses.length == 1){
            return this.code_C(clauses[0], rho);
        }else{

            let result: string[] = [];
            let result2: string[] = [];

            for(let clause of clauses){
                this.labelGenerator();
                result.push(label + ":");
                result.push(this.code_C(clause, rho));

            }


            return label + "setbtp" + "\n" + "try" + label ;
        }



    }



    private code_Program(program: Program){

        //bei erster variable value " " auf variable setzen
        let rho: Map<string, number> = new Map([["variable1", 1]]);

        let name: string = program.clauses[0].head.name;
        let number: string = program.clauses[0].head.variables.length.toString();
        let s1: string = "(" + name + "/" + number + ")";

        const mapClauses: Map<string, Clause[]> = new Map([[s1, [program.clauses[0]]]]);

        for(let i = 1; i < program.clauses.length; i++) {

            name = program.clauses[i].head.name;
            number= program.clauses[i].head.variables.length.toString();
            let predicateNew: string = "(" + name + "/" + number + ")";

            name = program.clauses[i - 1].head.name;
            number= program.clauses[i - 1].head.variables.length.toString();
            let predicateOld: string = "(" + name + "/" + number + ")";

            if(predicateNew == predicateOld){
                let list: Clause[] = mapClauses.get(predicateOld) as Clause[];
                list.push(program.clauses[i]);
                mapClauses.set(predicateOld, list );

            }else{
                mapClauses.set(predicateNew, [program.clauses[i]]);
            }

            let result1: string[] = [];
            for (let goal of program.query.goals){
                result1.push(this.code_G(goal, rho));
            }

            let result2: string[] = [];
            for (let clauses of mapClauses.values()){
                for(let keys of mapClauses.keys()) {
                    result2.push(this.code_P(clauses, keys, rho));
                }
            }

            return "init A" + "\n" + "pushenv" + "rho.length" + "\n" + result1.join("\n")
                + result1.join("\n");
      }
    }
}
