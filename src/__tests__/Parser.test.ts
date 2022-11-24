import {Parsing} from "../parser/Parsing";
import {CodeGenerator} from "../parser/CodeGenerator";

test("parsing", () => {
    //let program = Parsing.parse("t(X) <= X = b q(X) <= s(X) <= X = b, X = a");
    //let program = Parsing.parse("b(X) <= X = f(X,Y) <= X = f(a, b, _)");
    //const program = Parsing.parse("t(X) <= X = b q(X)   <= s(X) s(X) <= X = a p() <= q(X),t(X) s(X) <= t(X) <= p()");

    const program = Parsing.parse("bigger(X,Y) <= X = e, Y = h bigger(X,Y) <= X = h, X = d bigger(X,Y) <= ")
    const code: CodeGenerator = new CodeGenerator();
    console.log(code.code_Program(program));



});
/*
bigger(X,Y) :- X = elephant, Y = horse.
bigger(X,Y) :- X = horse, Y = donkey.
bigger(X,Y) :- X = donkey, Y = dog.
bigger(X,Y) :- X = donkey, Y = monkey.
is_bigger(X,Y) :- bigger(X,Y).
is_bigger(X,Y) :- bigger(X,Z), is_bigger(Z,Y).

 */