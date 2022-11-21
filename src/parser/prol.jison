
/* description: Parses and compiles ProL to WiM instructions. */

/* prologue */
%{
//import {Anon, Application, Atom, Clause, Goal, Head, Literal, Program, Query, Term, Unification, Variable} from "./model/*";
import {Anon} from "./model/Anon";
import {Application} from "./model/Application";
import {Atom} from "./model/Atom";
import {Clause} from "./model/Clause";
import {Goal} from "./model/Goal";
import {Head} from "./model/Head";
import {Literal} from "./model/Literal";
import {Program} from "./model/Program";
import {Query} from "./model/Query";
import {Term} from "./model/Term";
import {Unification} from "./model/Unification";
import {Variable} from "./model/Variable";
%}

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b  return 'INT_CONSTANT';
[a-z]([a-z]|[A-Z])*\b return 'STR_CONSTANT';
[A-Z]([a-z]|[A-Z])*\b return 'VARIABLE';
"<="                  return 'IMPLICATION';
"_"                   return '_';
"("                   return '(';
")"                   return ')';
","                   return ',';
"="                   return '=';
"["                   return '[';
"]"                   return ']';
<<EOF>>               return 'EOF';
.                     return 'INVALID';

/lex

/* operator associations and precedence */

%start program

%% /* language grammar */

program
    : p EOF
        { typeof console !== 'undefined' ? console.log($1) : print($1);
          return $1; }
    ;

p   : cr a
        {
            $$ = new Program($1, $2)
        }
    ;

cr  : c
        {
            $$ = [$1]
        }
    | cr c
        {
            $$ = $1.concat($2)
        }
    ;

a   : IMPLICATION gr
        {
            $$ = new Query($2)
        }
    ;

gr  : g
        {
            $$ = [new Goal($1)]
        }
    | gr ',' g
        {
            $$ = $1.concat($3)
        }
    ;

c   : STR_CONSTANT '(' xr ')' IMPLICATION gr
        {
            $$ = new Clause(new Head($1, $3), $6)
        }
    ;

xr  : VARIABLE
        {
            $$ = [new Variable($1)]
        }
    | VARIABLE ',' xr
        {
            $$ = $1.concat($3)
        }
    ;

g   : STR_CONSTANT '(' tr ')'
        {
            $$ = new Literal($1, $3)
        }
    | VARIABLE '=' t
        {
            $$ = new Unification($1, $3)
        }
    ;

t   : at
    | VARIABLE
        {
            $$ = new Variable($1)
        }
    | '_'
        {
            $$ = new Anon()
        }
    | STR_CONSTANT '(' tr ')'
        {
            $$ = new Application($1, $3)
        }
    ;

/*
*/
at  : INT_CONSTANT
        {
            $$ = new Atom($1)
        }
    | STR_CONSTANT
        {
            $$ = new Atom($1)
        }
    ;

tr  : t
        {
            $$ = [new Term($1)]
        }
    | tr ',' t
        {
            $$ = $1.concat($3)
        }
    ;
