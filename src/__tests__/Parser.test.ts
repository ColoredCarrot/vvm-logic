import {Parsing} from "../parser/Parsing";
import {CodeGenerator} from "../parser/CodeGenerator";

test("parsing", () => {
    //let program = Parsing.parse("t(X) <= X = b q(X) <= s(X) <= X = b, X = a");
    //let program = Parsing.parse("b(X) <= X = f(X,Y) <= X = f(a, b, _)");
    const program = Parsing.parse("t(X) <= X = b q(X)   <= s(X) s(X) <= X = a p() <= q(X),t(X) s(X) <= t(X) <= p()");
    //const program = Parsing.parse("bigger(X,Y) <= X = elephant, Y = horse <= b(X,Y)");

    const code: CodeGenerator = new CodeGenerator();
    console.log(code.code_Program(program));


});
