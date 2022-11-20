import {Parsing} from "../parser/Parsing";

test("parsing", () => {
    let program = Parsing.parse("b(X) <= X = f(X,Y) <= X = f(a, b, _)")
});

