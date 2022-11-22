import {Parsing} from "../parser/Parsing";
import {CodeGenerator} from "../parser/CodeGenerator";

test("parsing", () => {
    let program = Parsing.parse("t(X) <= X = b q(X) <= s(X) <= X = b");
    /*let code: CodeGenerator = new CodeGenerator();
    code.code_Program(program);
    //b(X) <= X = f(X,Y) <= X = f(a, b, _)
    
     */




});

