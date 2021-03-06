function visualize() {
	if (!(curCmd in execCmds)) {
		visual = window.clearInterval(visual);
		return;
	}
	
	var execCmd = execCmds[curCmd];
	focusSlot(execCmd);
	if (curCmd in swaps) {
		visualizeSwap(swaps[curCmd].index1, swaps[curCmd].index2);
	}
	curCmd++;
}

function focusSlot(slotId) {
	$('.focus').removeClass('focus');
	$('#slot-' + slotId).addClass('focus');
}

function visualizeSwap(index1, index2) {
	$('#bar-' + index1).css('background-color', '#d0d050');
	$('#bar-' + index2).css('background-color', '#d0d050');
	
	var width1 = $('#bar-' + index1).css('width');
	var val1 = $('#bar-' + index1).html();
	var width2 = $('#bar-' + index2).css('width');
	var val2 = $('#bar-' + index2).html();
	
	$('#bar-' + index1).animate({width : width2}, 'fast', null, function() {
		$('#bar-' + index1).css('background-color', '#d05050');
	});
	$('#bar-' + index1).html(val2);
	$('#bar-' + index2).animate({width : width1}, 'fast', null, function() {
		$('#bar-' + index2).css('background-color', '#d05050');
	});
	$('#bar-' + index2).html(val1);
}

function Block(commands) {
	this.commands = commands;
}

Block.prototype.interpret = function() {
	for (var i = 0; i < this.commands.length; i++) {
		slotId = this.commands[i].id;
		execCmds.push(slotId);
		if (this.commands[i] instanceof ArrSwap) {
			this.commands[i].execKey = execCmds.length - 1;
		}
		this.commands[i].interpret();
	}
};

Block.prototype.addCommand = function(command) {
	this.commands[this.commands.length + 1] = command;
};

function Command(obj) {
	this.obj = obj;
};

Command.prototype.interpret = function() {
	return this.obj.interpret();
};

function WhileLoop(condition, block) {
	this.condition = condition;
	this.block = block;
}

WhileLoop.prototype.interpret = function() {
	while(this.condition.interpret() > 0) {
		this.block.interpret();
	}
};

function Condition(expr) {
	this.expr = expr;
}

Condition.prototype.interpret = function() {
	return this.expr.interpret();
};

function Literal(num) {
	this.num = num;
}

Literal.prototype.interpret = function() {
	return this.num;
};

function Expression(obj) {
	this.obj = obj;
}

Expression.prototype.interpret = function() {
	return this.obj.interpret();
};

function Assignment(varName, expr) {
	this.varName = varName;
	this.expr = expr;
}

Assignment.prototype.interpret = function() {
	vars[this.varName.getVarName()] = this.expr.interpret();
};

function VarName(varName) {
	this.varName = varName;
	vars[varName] = 0;
}

// Return the value of the variable.
VarName.prototype.interpret = function() {
	return vars[this.varName];
};

// Return the name of the variable.
VarName.prototype.getVarName = function() {
	return this.varName;
};

function ArrSwap(expr1, expr2) {
	this.expr1 = expr1;
	this.expr2 = expr2;
}

ArrSwap.prototype.interpret = function() {
	literal1 = this.expr1.interpret();
	literal2 = this.expr2.interpret();
	var swapVar = arr[literal1];
	arr[literal1] = arr[literal2];
	arr[literal2] = swapVar;
	swaps[this.execKey] = {
		index1 : literal1,
		index2 : literal2
	};
};

function Comparison(symbol, leftExpr, rightExpr) {
	this.symbol = symbol;
	this.leftExpr = leftExpr;
	this.rightExpr = rightExpr;
}

Comparison.prototype.interpret = function() {
	var result = 0;
	var leftExprVal = this.leftExpr.interpret();
	var rightExprVal = this.rightExpr.interpret();
	switch (this.symbol) {
	case '<' :
		result = leftExprVal < rightExprVal ? 1 : 0;
		break;
	case '<=' :
		result = leftExprVal <= rightExprVal ? 1 : 0;
		break;
	case '==' :
		result = leftExprVal == rightExprVal ? 1 : 0;
		break;
	case '>' :
		result = leftExprVal > rightExprVal ? 1 : 0;
		break;
	case '>=' :
		result = leftExprVal >= rightExprVal ? 1 : 0;
		break;
	case '!=' :
		result = leftExprVal != rightExprVal ? 1 : 0;
		break;
	default:
		console.log('Illegal comparison symbol: ' + this.symbol);
	}
	
	return result;
};

function ArithmeticExpression(symbol, leftExpr, rightExpr) {
	this.symbol = symbol;
	this.leftExpr = leftExpr;
	this.rightExpr = rightExpr;
}

ArithmeticExpression.prototype.interpret = function() {
	var result = 0;
	var leftExprVal = this.leftExpr.interpret();
	var rightExprVal = this.rightExpr.interpret();
	switch (this.symbol) {
	case '+' :
		result = leftExprVal + rightExprVal;
		break;
	case '-' :
		result = leftExprVal - rightExprVal;
		break;
	default :
		console.log('Illegal arithmetic operator symbol: ' + this.symbol);
	}
	
	return result;
};

function ArrAccess(index) {
	this.index = index;
}

ArrAccess.prototype.interpret = function() {
	return arr[this.index.interpret()];
};

function Conditional(condition, ifBlock, elseBlock) {
	this.condition = condition;
	this.ifBlock = ifBlock;
	this.elseBlock = elseBlock;
}

Conditional.prototype.interpret = function() {
	if (this.condition.interpret() > 0) {
		this.ifBlock.interpret();
	} else {
		this.elseBlock.interpret();
	}
};

function ForLoop(index, start, end, block) {
	this.indexVarName = index.getVarName();
	this.start = start;
	this.end = end;
	this.block = block;
	vars[this.indexVarName] = start.interpret();
}

ForLoop.prototype.interpret = function() {
	for (vars[this.indexVarName] = this.start.interpret(); vars[this.indexVarName] <= this.end.interpret(); vars[this.indexVarName]++) {
		this.block.interpret();
	}
};

function ArrLength() {
	
}

ArrLength.prototype.interpret = function() {
	return arr.length;
};

function ArrLast() {
	
}

ArrLast.prototype.interpret = function() {
	return arr.length - 1;
};