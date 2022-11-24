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

    private labelCounter = 0;

    //Codetranslations for Prolog - based on Instructions in "Translation of Virtual Machines", Helmut Seidl


    private code_A(term: Term, setArg: Set<string>, rho: Map<string, number>): string {

        //Term differentiation: Anon, Variable (Initialized/Uninitialized), Atom, Application

        switch (term.value.kind) {

        case "Atom": {

            const atom = term.value as Atom;
            return `putatom ${atom.value}`;

        }

        case "Variable": {

            const variable = term.value as Variable;

            if (rho.has(variable.name)) {
                if (!setArg.has(variable.name)) {
                    setArg.add(variable.name);
                    return "putvar " + rho.get(variable.name);
                }

                return "putref " + rho.get(variable.name);
            } else {
                rho.set(variable.name, rho.size + 1);

                if (setArg.has(variable.name)) {
                    return "putref " + rho.get(variable.name);
                }

                setArg.add(variable.name);
                return "putvar " + rho.get(variable.name);
            }
        }

        case "Anon": {

            return "putanon";
        }

        case "Application": {

            const application = term.value as Application;

            const result: string[] = [];
            for (const term of application.terms) {
                result.push(this.code_A(term, setArg, rho));
            }

            const k = application.terms.length;

            return result.join("\n") + "\n" + `putstruct ${application.name}/${k}`;

        }

        default: {

            throw `Error while parsing: Unknown term kind: ${term.value.kind}`;

        }
        }
    }

    private code_U(term: Term, setArg: Set<string>, rho: Map<string, number>): string {

        //Unification term differentiation: Anon, Variable (Initialized/Uninitialized), Atom, Application

        switch (term.value.kind) {

        case "Atom": {

            const atom = term.value as Atom;
            return `uatom ${atom.value}`;

        }

        case "Variable": {

            const variable = term.value as Variable;

            if (rho.has(variable.name)) {
                if (!setArg.has(variable.name)) {
                    setArg.add(variable.name);
                    return "uvar " + rho.get(variable.name);
                }

                return "uref " + rho.get(variable.name);
            } else {
                rho.set(variable.name, rho.size + 1);

                if (setArg.has(variable.name)) {
                    return "uref " + rho.get(variable.name);
                }

                setArg.add(variable.name);
                return "uvar " + rho.get(variable.name);
            }
        }

        case "Anon": {

            return "pop";
        }

        case "Application": {
            return this.code_A(term, setArg, rho) + "\n" + "unify";
        }

        default: {

            throw `Error while parsing: Unknown term kind: ${term.value.kind}`;

        }
        }
    }

    private code_G(goal: Goal, setArg: Set<string>, rho: Map<string, number>): string {

        // call Code_A on Unification or Literal

        switch (goal.value.kind) {

        case "Literal": {

            const literal = goal.value as Literal;

            const result: string[] = [];
            for (const term of literal.terms) {
                result.push(this.code_A(term, setArg, rho));
            }

            const k = literal.terms.length;
            const label = this.getNextLabel();

            if (result.length == 0) {
                return "mark " + label + "\n" + `call ${literal.name}/${k}` + "\n" + label + ":";
            } else {
                return "mark " + label + "\n" + result.join("\n") + "\n" + `call ${literal.name}/${k}` + "\n" + label + ":";
            }
        }


        case "Unification": {

            const unification = goal.value as Unification;

            if (rho.has(unification.variable.name)) {
                if (!setArg.has(unification.variable.name)) {
                    setArg.add(unification.variable.name);
                    return "putvar " + rho.get(unification.variable.name) + "\n" + this.code_A(unification.term, setArg, rho) + "\n" + "bind";
                }

                return "putref " + rho.get(unification.variable.name) + "\n" + this.code_U(unification.term, setArg, rho);
            } else {
                rho.set(unification.variable.name, rho.size + 1);

                if (setArg.has(unification.variable.name)) {
                    return "putref " + rho.get(unification.variable.name) + "\n" + this.code_U(unification.term, setArg, rho);
                }

                setArg.add(unification.variable.name);
                return "putvar " + rho.get(unification.variable.name) + "\n" + this.code_A(unification.term, setArg, rho) + "\n" + "bind";
            }
        }

        default: {

            throw `Error while parsing: Unknown goal kind: ${goal.value.kind}`;

        }
        }
    }


    private code_C(clause: Clause, rho: Map<string, number>): string {

        //call Code_G on the goals of one Clause

        const setArguments = new Set<string>;
        for (const variable of clause.head.variables) {
            setArguments.add(variable.name);
        }

        const result: string[] = [];
        for (const goal of clause.goals) {
            result.push(this.code_G(goal, setArguments, rho));
        }

        return "pushenv " + rho.size + "\n" + result.join("\n") + "\n" + "popenv";

    }

    private code_P(clauses: Clause[], label: string): string {

        //call code_C on clauses with the same predicate
        const rho = new Map<string, number>();

        if (clauses.length == 1) {
            return `${label}:\n` + this.code_C(clauses[0], rho);
        } else {

            const result1: string[] = [];
            const result2: string[] = [];
            const result3: string[] = [];

            for (const clause of clauses) {
                const labelNew = this.getNextLabel();
                result1.push("try " + labelNew);
                result3.push(labelNew);
                result2.push(labelNew + ":");
                result2.push(this.code_C(clause, rho));
            }

            const labelNew = result3.pop();

            result1.pop();

            return `${label}:\n` +
                "setbtp\n" +
                result1.join("\n") + "\n" +
                "delbtp\n" +
                `jump ${labelNew}\n` +
                result2.join("\n");

        }

    }


    public code_Program(program: Program): string {

        //Rho Initialize:

        const rho: Map<string, number> = new Map();

        //call Code_G on Goals of the Program

        const result1: string[] = [];
        const queryScope = new Set<string>;
        for (const goal of program.query.goals) {
            console.log(result1.push(this.code_G(goal, queryScope, rho)));
        }

        const queryVariableCount = rho.size;

        //Predicate Generation

        const map: Map<string, Clause[]> = new Map();
        for (const clause of program.clauses) {
            const name = clause.head.name;
            const k = clause.head.variables.length;
            const label = `${name}/${k}`;

            if (map.has(label)) {
                // @ts-ignore
                map.get(label).push(clause);
            } else {
                map.set(label, [clause]);
            }
        }

        const result2: string[] = [];
        for (const keys of map.keys()) {
            result2.push(this.code_P(map.get(keys)!, keys));
        }

        return "jump START\n" +
            "A:\n" +
            "no\n" +
            "START:\n" +
            "init A\n" +
            `pushenv ${queryVariableCount}\n` +
            result1.join("\n") + "\n" +
            `halt ${queryVariableCount}\n` +
            result2.join("\n");
    }


    private getNextLabel(): string {

        const label = "ABCDEFGHIJKLMNOPQRSTUVW";
        this.labelCounter++;
        if (this.labelCounter > 24) {
            this.labelCounter = -1;
            return label.charAt(this.labelCounter++) + this.labelCounter;
        }

        return label.charAt(this.labelCounter);
    }


    // Übersetzungsfunktion Code_U für optimierte Unifikationsbehandlung: uatom, uvar, pop, uref, ustruct, son, up, bind
}
