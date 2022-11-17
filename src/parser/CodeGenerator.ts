import {Anon} from "./model/Anon";
import {Application} from "./model/Application";
import {Atom} from "./model/Atom";
import {Term} from "./model/Term";
import {Variable} from "./model/Variable";
import {Literal} from "./model/Literal";
import {Goal} from "./model/Goal";
import {Unification} from "./model/Unification";
import {Clause} from "./model/Clause";


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
            // FIXME: seite 129
            let unification = goal.value as Unification;
            return `putref p(${unification.variable.name})` + "\n" + this.code_A(unification.term, rho) + "\n"
                + "unify";

        default:
            throw `Error while parsing: Unknown goal kind: ${goal.value.kind}`;
        }
    }

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

    private code_P(clauses: Clause[], rho: void): string {
        if(clauses.length == 1){
            return this.code_C(clauses[0], rho);
        }
        return ""
    }
}
