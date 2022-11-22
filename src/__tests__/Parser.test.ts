import {Parsing} from "../parser/Parsing";
import {CodeGenerator} from "../parser/CodeGenerator";

test("parsing", () => {
    //let program = Parsing.parse("t(X) <= X = b q(X) <= s(X) <= X = b ");
    //let program = Parsing.parse("b(X) <= X = f(X,Y) <= X = f(a, b, _)");
   // let program = Parsing.parse("t(X) <= X = b <= t(X)");
    let program = Parsing.parse("t(X) <= X = b q(X) <= s(X) s(X) <= X = a p() <= q(X),t(X) s(X) <= t(X) <= p()");


    let code: CodeGenerator = new CodeGenerator();
    console.log(code.code_Program(program));
    //b(X) <= X = f(X,Y) <= X = f(a, b, _)
    //t(X) <= X = b q(X) <= s(X) <= X = b --> Variablen problem
});

