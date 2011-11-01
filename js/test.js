var arr = [13, 2, 15, 6, 1, 4, 8, 19, 17, 20];
var vars = {};

// Swapping two elements of the array.
console.log('Test case - swapping two elements of the array.');
var literal1 = new Literal(0);
var literal2 = new Literal(1);
var expr1 = new Expression(literal1);
var expr2 = new Expression(literal2);
var arrSwap = new ArrSwap(expr1, expr2);
arrSwap.interpret();
console.log(arr);

// Assignment and while loop.
console.log('Test case - assignment and while loop.');
var varA = new VarName('A');
var lit1 = new Literal(1);
var initAssignment = new Assignment(varA, lit1);

var whileCondition = new Condition(varA);

var lit0 = new Literal(0);
var changeAssignment = new Assignment(varA, lit0);
var whileBlock = new Block([changeAssignment]);

var whileLoop = new WhileLoop(whileCondition, whileBlock);

var mainBlock = new Block([initAssignment, whileLoop]);

console.log(mainBlock);
mainBlock.interpret();
console.log(vars);

// While loop with comparison in condition.
console.log('Test case - while loop with comparison in condition.');
var varA = new VarName('A');
var lit1 = new Literal(1);
var initAssignment = new Assignment(varA, lit1);

var lit5 = new Literal(5);
var conditionComp = new Comparison('<', varA, lit5);
var whileCondition = new Condition(conditionComp);

var changeAssignment = new Assignment(varA, lit5);
var whileBlock = new Block([changeAssignment]);
var whileLoop = new WhileLoop(whileCondition, whileBlock);
var mainBlock = new Block([initAssignment, whileLoop]);

console.log(mainBlock);
mainBlock.interpret();
console.log(vars);

// While loop with increment.
console.log('Test case - while loop with increment.');
var varA = new VarName('A');
var lit0 = new Literal(0);
var initAssignment = new Assignment(varA, lit0);

var lit5 = new Literal(5);
var conditionComp = new Comparison('<', varA, lit5);
var whileCondition = new Condition(conditionComp);

var lit2 = new Literal(2);
var incrAddition = new ArithmeticExpression('+', varA, lit2);
var changeAssignment = new Assignment(varA, incrAddition);
var whileBlock = new Block([changeAssignment]);
var whileLoop = new WhileLoop(whileCondition, whileBlock);
var mainBlock = new Block([initAssignment, whileLoop]);

console.log(mainBlock);
mainBlock.interpret();
console.log(vars);

// Assignment with array access.
console.log('Test case - assignment with array access.');
var varA = new VarName('A');
var lit1 = new Literal(1);
var access = new ArrAccess(lit1);
var assign = new Assignment(varA, access);
var mainBlock = new Block([assign]);

console.log(mainBlock);
mainBlock.interpret();
console.log(vars);

// Conditional.
console.log('Test case - conditional.');
var lit1 = new Literal(1);

var varA = new VarName('A');
var ifAssign = new Assignment(varA, lit1);
var ifBlock = new Block([ifAssign]);

var lit2 = new Literal(2);
var elseAssign = new Assignment(varA, lit2);
var elseBlock = new Block([elseAssign]);

var cond = new Conditional(lit1, ifBlock, elseBlock);
var mainBlock = new Block([cond]);

console.log(mainBlock);
mainBlock.interpret();
console.log(vars);

// For .. in loop.
console.log('Test case - for .. in loop.');
var varA = new VarName('A');
var lit1 = new Literal(0);
var lit5 = new Literal(2);

var varB = new VarName('B');
var loopAssignment = new Assignment(varB, varA);
var loopBlock = new Block([loopAssignment]);
var loop = new ForLoop(varA, lit1, lit5, loopBlock);
var mainBlock = new Block([loop]);

console.log(mainBlock);
mainBlock.interpret();
console.log(vars);