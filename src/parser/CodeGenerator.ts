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


export class CodeGenerator {
    private code_A(term: Term, rho: void): string {

        switch (term.value.kind) {
        case "Atom":
            let atom = term.value as Atom;
            return `putatom ${atom.value}`;

        case "Variable":
            let variable = term.value as Variable;
            // TODO
            return "";

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

    private code_G(goal: Goal, rho: void): string {
        switch (goal.value.kind) {
        case "Literal":

            let literal = goal.value as Literal;

            // FIXME: replace B with actual label
            let result: string[] = [];
            for (let term of literal.terms) {
                result.push(this.code_A(term, rho));
            }

            let k = literal.terms.length;

            return `mark B` + "\n" + result.join("\n") + "\n" + `call ${literal.name}/${k}` + "\nB:\n";


        case "Unification":
            // FIXME: seite 129, pho

            /*if Variable uninitialisiert:

            let unification_notinit = goal.value as Unification;
            return `putvar p(${unification.variable.name})` + "\n" + this.code_A(unification.term, rho) + "\n"
                + "bind";

             */
            //if Variable initialisiert:

            let unification_init = goal.value as Unification;
            return `putref p(${unification_init.variable.name})` + "\n" + this.code_A(unification_init.term, rho) + "\n"
                + "unify";

        default:
            throw `Error while parsing: Unknown goal kind: ${goal.value.kind}`;
        }
    }

    //TODO: optimierte Unifikationsbehandloung

    private code_U(unification: Unification, rho: void): string {
        //FIXME:
        return "";
    }

    private code_C(clause: Clause, rho: void): string {

        let result: string[] = [];
        for (let goal of clause.goals) {
            result.push(this.code_G(goal, rho));
        }
        //FIXME: m unbekannt
        return `pushenv m` + "\n" + result.join("\n") + "\n"+ "popenv";

    }

    /*private code_P(clause: Clause  rho: void): string {

        if(clauses.length == 1){
            this.code_C(clauses[0]);
        }



    }

     */

    private code_Program(program: Program, rho: void){
        /*let result1: string[] = [];
        for (let goal of program.query.goals) {
            result1.push(this.code_G(goal, rho));
        }

        let result2: string[] = [];
        for (let clause of program.clauses) {
            result2.push(this.code_P(clause));
        }
        return `init A` + "\n" + `pushenv d`+ "\n" + result1.join("\n") + "\n" + "halt d" + "\n" + "A: no"

         */
    }
}
