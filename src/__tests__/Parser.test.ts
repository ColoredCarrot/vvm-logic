import {Parsing} from "../parser/Parsing";

test("parsing", () => {
    let program = Parsing.parse("b(X) <= X = f(X,Y) <= X = f(a, b, _)")
});

test("parsing", () => {
    let program = Parsing.parse("f (g(X, Y), a, Z)")
});