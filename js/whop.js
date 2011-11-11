var arr = [];
var vars = {};
var slots = [];
var focus = 0;
var counter = 0;
var curBlock = 0;

var execCmds = [];
var curCmd = 0;
var swaps = [];
var visual = null;

var whop = {
	arrLength : 20,
	
	delay : 1000,
	
	init : function() {
		Array.prototype.shuffle = function() {
			var length = this.length;
			var index = length;
			while (index--) {
				var randInt = parseInt(Math.random() * length);
				var tmp = this[index];
				this[index] = this[randInt];
				this[randInt] = tmp;
			}
		};
		
		for (var i = 0; i < this.arrLength; i++) {
			arr[i] = i;
		}
		arr.shuffle();
		
		slots[counter++] = {
			type : 'Block',
			cmds : [counter],
		};
		slots[counter++] = {};
		focus = counter - 1;
	
		this.ui.init();
	},
	
	ui : {
		init : function() {
			this.initRunTools();
			$('#listing-container').append('<h4>Program</h4>');
			this.initTools();
			this.initVisual();
			whop.listing.render();
		},
		
		initTools : function() {
			$('div.tool').click(function() {
				whop.listing.insert($(this).attr('id'));
				whop.listing.render();
			});
			$('#variable-select').change(function() {
				var varName = $('#variable-select option:selected').val();
				whop.listing.insertVar(varName);
				whop.listing.render();
				$('#variable-select option:selected').attr('selected', false);
				$('#variable-select option:first-child').attr('selected', true);
			});
			$('#literal-select').change(function() {
				var literalVal = $('#literal-select option:selected').val();
				whop.listing.insertLiteral(literalVal);
				whop.listing.render();
				$('#literal-select option:selected').attr('selected', false);
				$('#literal-select option:first-child').attr('selected', true);
			});
		},
		
		initRunTools : function() {
			$('#run').click(function() {
				var program = whop.program.build(0);
				whop.program.run(program);
			});
		},
		
		initVisual : function() {
			for (var i = 0; i < arr.length; i++) {
				var barStr = '<div class="bar" id="bar-' + i + '">' + arr[i] + '</div>';
				$('#visual-container').append(barStr);
				var unitWidth = 10;
				var barWidth = unitWidth * arr[i];
				$('#bar-' + i).css('width', barWidth + 'px');
			}
		}
	},
	
	listing : {
		render : function() {
			$('#slot-0').remove();
			$('#listing-container').append(this.renderSlot(0));
			this.bindHandles();
		},
		
		renderSlot : function(index, isInline) {
			if (isInline == null) {
				isInline = false;
			}
			var obj = slots[index];
			
			if (focus == index) {
				var focusStr = ' focus';
			} else {
				var focusStr = '';
			}
			var idStr = 'id="slot-' + index + '"';
			var handleStr = '<span class="slot-handle" id="handle-' + index + '">#' + index + '</span>';
			
			var result = '';
			switch (obj.type) {
			case 'Block' :
				var renderedCmds = [];
				for (var i = 0; i < obj.cmds.length; i++) {
					renderedCmds[i] = this.renderSlot(obj.cmds[i]);
				}
				result = '<div class="block' + focusStr + '" ' + idStr + '><span class="add-cmd" id="add-cmd-' + index + '">+</span>' + renderedCmds.join('') + '</div>';
				break;
			case 'Assignment' :
				var renderedLeft = this.renderSlot(obj.left, true);
				var renderedRight = this.renderSlot(obj.right, true);
				result = '<div class="simple-command' + focusStr + '" ' + idStr + '>' + handleStr +
					renderedLeft + ' = ' + renderedRight + '</div>';
				break;
			case 'VarName' :
				result = '<div class="inline-slot' + focusStr + '" ' + idStr + '>' + handleStr + slots[index].val + '</div>';
				break;
			case 'Literal' :
				result = '<div class="inline-slot' + focusStr + '" ' + idStr + '>' + handleStr + slots[index].val + '</div>';
				break;
			case 'WhileLoop' :
				var renderedCondition = this.renderSlot(obj.condition, true);
				var renderedBlock = this.renderSlot(obj.block);
				result = '<div class="complex-command' + focusStr + '" ' + idStr + '>' + handleStr +
					'<div class="command-header">while ' + renderedCondition + '</div>' +
					'<div class="command-body">' + renderedBlock + '</div></div>';
				break;
			case 'ForLoop' :
				var renderedIndex = this.renderSlot(obj.index, true);
				var renderedStart = this.renderSlot(obj.start, true);
				var renderedEnd = this.renderSlot(obj.end, true);
				var renderedBlock = this.renderSlot(obj.block);
				result = '<div class="complex-command' + focusStr + '" ' + idStr + '>' + handleStr +
					'<div class="command-header">for ' + renderedIndex + ' in ' + renderedStart + ' .. ' + renderedEnd + '</div>' +
					'<div class="command-body">' + renderedBlock + '</div></div>';
				break;
			case 'ArrLast' :
				result = '<div class="inline-slot' + focusStr + '" ' + idStr + '>' + handleStr + 'End of array</div>';
				break;
			case 'Conditional' :
				var renderedCondition = this.renderSlot(obj.condition, true);
				var renderedIfClause = this.renderSlot(obj.ifClause);
				var renderedElseClause = this.renderSlot(obj.elseClause);
				result = '<div class="complex-command' + focusStr + '" ' + idStr + '>' + handleStr +
					'<div class="command-header">if ' + renderedCondition + '</div>' +
					'<div class="command-body">' + renderedIfClause + '</div>' +
					'<div class="command-header">else</div>' +
					'<div class="command-body">' + renderedElseClause + '</div></div>';
				break;
			case 'Comparison' :
				var renderedSymbol = obj.symbol;
				if (obj.symbol == '<') {
					renderedSymbol = '&lt;';
				} else if (obj.symbol == '>') {
					renderedSymbol = '&gt;';
				}
				var renderedLeft = this.renderSlot(obj.left, true);
				var renderedRight = this.renderSlot(obj.right, true);
				result = '<div class="inline-slot' + focusStr + '" ' + idStr + '>' + handleStr + renderedLeft + ' ' + renderedSymbol + ' ' +
					renderedRight + '</div>';
				break;
			case 'ArrAccess' :
				var renderedIndex = this.renderSlot(obj.index, true);
				result = '<div class="inline-slot' + focusStr + '" ' + idStr +'>' + handleStr + '[' + renderedIndex + ']</div>';
				break;
			case 'ArithmeticExpression' :
				var renderedLeft = this.renderSlot(obj.left, true);
				var renderedRight = this.renderSlot(obj.right, true);
				result = '<div class="inline-slot' + focusStr + '" ' + idStr + '>' + handleStr + renderedLeft + ' ' +
					obj.symbol + ' ' + renderedRight + '</div>';
				break;
			case 'ArrSwap' :
				var renderedIndex1 = this.renderSlot(obj.index1, true);
				var renderedIndex2 = this.renderSlot(obj.index2, true);
				result = '<div class="simple-command' + focusStr + '" ' + idStr + '>' + handleStr +
					'Array swap (' + renderedIndex1 + ', ' + renderedIndex2 + ')</div>';
				break;
			default :
				var classStr = isInline ? 'inline-slot' : 'slot';
				result = '<div class="' + classStr + focusStr + '" ' + idStr + '>' + handleStr + '</div>';
			}
			
			return result;
		},
		
		bindHandles : function() {
			$('span.slot-handle').click(function() {
				$('div.focus').removeClass('focus');
				
				var idStr = $(this).attr('id');
				var idArr = idStr.split('-');
				var slotId = idArr[1];
				focus = slotId;
				$('#slot-' + slotId).addClass('focus');
			});
			$('span.add-cmd').click(function() {
				var idStr = $(this).attr('id');
				var idArr = idStr.split('-');
				var slotId = idArr[2];
				whop.listing.addCmd(slotId);
				whop.listing.render();
			});
		},
		
		insert : function(tool) {
			switch (tool) {
			case 'assignment' :
				var leftSlotKey = counter++;
				var rightSlotKey = counter++;
				slots[leftSlotKey] = {};
				slots[rightSlotKey] = {};
				slots[focus] = {
					type : 'Assignment',
					left : leftSlotKey,
					right : rightSlotKey
				};
				focus = leftSlotKey;
				this.addSlot();
				break;
			case 'while' :
				var conditionKey = counter++;
				var blockKey = counter++;
				var blockFirstCommandKey = counter++;
				slots[conditionKey] = {};
				slots[blockFirstCommandKey] = {};
				slots[blockKey] = {
					type : 'Block',
					cmds : [blockFirstCommandKey]
				};
				slots[focus] = {
					type : 'WhileLoop',
					condition : conditionKey,
					block : blockKey
				};
				focus = conditionKey;
				this.addSlot();
				break;
			case 'for' :
				var indexKey = counter++;
				var startKey = counter++;
				var endKey = counter++;
				var blockKey = counter++;
				var blockFirstCommandKey = counter++;
				slots[indexKey] = {};
				slots[startKey] = {};
				slots[endKey] = {};
				slots[blockFirstCommandKey] = {};
				slots[blockKey] = {
					type : 'Block',
					cmds : [blockFirstCommandKey]
				};
				slots[focus] = {
					type : 'ForLoop',
					index : indexKey,
					start : startKey,
					end : endKey,
					block : blockKey,
				};
				focus = indexKey;
				this.addSlot();
				break;
			case 'end' :
				slots[focus] = {
					type : 'ArrLast',
				};
				this.incrementFocus();
				break;
			case 'conditional' :
				var conditionKey = counter++;
				var ifClauseKey = counter++;
				var ifClauseFirstCommandKey = counter++;
				var elseClauseKey = counter++;
				var elseClauseFirstCommandKey = counter++;
				slots[conditionKey] = {};
				slots[ifClauseFirstCommandKey] = {};
				slots[ifClauseKey] = {
					type : 'Block',
					cmds : [ifClauseFirstCommandKey]
				};
				slots[elseClauseFirstCommandKey] = {};
				slots[elseClauseKey] = {
					type : 'Block',
					cmds : [elseClauseFirstCommandKey]
				};
				slots[focus] = {
					type : 'Conditional',
					condition : conditionKey,
					ifClause : ifClauseKey,
					elseClause : elseClauseKey
				};
				focus = conditionKey;
				this.addSlot();
				break;
			case 'greater' :
				var leftKey = counter++;
				var rightKey = counter++;
				slots[leftKey] = {};
				slots[rightKey] = {};
				slots[focus] = {
					type : 'Comparison',
					symbol : '>',
					left : leftKey,
					right : rightKey
				};
				focus = leftKey;
				break;
			case 'less' :
				var leftKey = counter++;
				var rightKey = counter++;
				slots[leftKey] = {};
				slots[rightKey] = {};
				slots[focus] = {
					type : 'Comparison',
					symbol : '<',
					left : leftKey,
					right : rightKey
				};
				focus = leftKey;
				break;
			case 'equality' :
				var leftKey = counter++;
				var rightKey = counter++;
				slots[leftKey] = {};
				slots[rightKey] = {};
				slots[focus] = {
					type : 'Comparison',
					symbol : '==',
					left : leftKey,
					right : rightKey
				};
				focus = leftKey;
				break;
			case 'inequality' :
				var leftKey = counter++;
				var rightKey = counter++;
				slots[leftKey] = {};
				slots[rightKey] = {};
				slots[focus] = {
					type : 'Comparison',
					symbol : '!=',
					left : leftKey,
					right : rightKey
				};
				focus = leftKey;
				break;
			case 'access' :
				var indexKey = counter++;
				slots[indexKey] = {};
				slots[focus] = {
					type : 'ArrAccess',
					index : indexKey
				};
				focus = indexKey;
				break;
			case 'addition' :
				var leftKey = counter++;
				var rightKey = counter++;
				slots[leftKey] = {};
				slots[rightKey] = {};
				slots[focus] = {
					type : 'ArithmeticExpression',
					symbol : '+',
					left : leftKey,
					right : rightKey
				}
				focus = leftKey; 
				break;
			case 'subtraction' :
				var leftKey = counter++;
				var rightKey = counter++;
				slots[leftKey] = {};
				slots[rightKey] = {};
				slots[focus] = {
					type : 'ArithmeticExpression',
					symbol : '-',
					left : leftKey,
					right : rightKey
				}
				focus = leftKey;
				break;
			case 'swap' :
				var index1Key = counter++;
				var index2Key = counter++;
				slots[index1Key] = {};
				slots[index2Key] = {};
				slots[focus] = {
					type : 'ArrSwap',
					index1 : index1Key,
					index2 : index2Key
				};
				focus = index1Key;
				this.addSlot();
				break;
			default:
				console.log('Unknown tool: ' + tool);
			}
		},
		
		addSlot : function() {
			var newSlotKey = counter++;
			slots[newSlotKey] = {};
			slots[curBlock].cmds.push(newSlotKey);
		},
		
		insertVar : function(varName) {
			slots[focus] = {
				type : 'VarName',
				val : varName
			};
			this.incrementFocus();
		},
		
		insertLiteral : function(literalVal) {
			slots[focus] = {
				type : 'Literal',
				val : literalVal
			};
			this.incrementFocus();
		},
		
		addCmd : function(index) {
			var newCmdKey = counter++;
			slots[newCmdKey] = {};
			slots[index].cmds.push(newCmdKey);
			focus = newCmdKey;
		},
		
		incrementFocus : function() {
			if (focus + 1 in slots) {
				if (slots[++focus].type == 'Block') {
					curBlock = focus;
					
					var cmds = slots[focus].cmds;
					focus = cmds[cmds.length - 1];
				}
			}
		}
	},
	
	program : {
		build : function(index) {
			var obj = slots[index];
			var result = null;
			switch (obj.type) {
			case 'Block' :
				var cmdCounter = 0;
				var cmds = [];
				for (var i = 0; i < obj.cmds.length; i++) {
					var builtCmd = this.build(obj.cmds[i]);
					if (builtCmd != null) {
						cmds[cmdCounter++] = builtCmd;
					}
				}
				result = new Block(cmds);
				break;
			case 'Assignment' :
				var builtLeft = this.build(obj.left);
				var builtRight = this.build(obj.right);
				result = new Assignment(builtLeft, builtRight);
				break;
			case 'VarName' :
				result = new VarName(obj.val);
				break;
			case 'Literal' :
				result = new Literal(obj.val);
				break;
			case 'WhileLoop' :
				var builtCondition = this.build(obj.condition);
				var builtBlock = this.build(obj.block);
				result = new WhileLoop(builtCondition, builtBlock);
				break;
			case 'ForLoop' :
				var builtIndex = this.build(obj.index);
				var builtStart = this.build(obj.start);
				var builtEnd = this.build(obj.end);
				var builtBlock = this.build(obj.block);
				result = new ForLoop(builtIndex, builtStart, builtEnd, builtBlock);
				break;
			case 'ArrLast' :
				result = new ArrLast();
				break;
			case 'ArithmeticExpression' :
				var builtLeft = this.build(obj.left);
				var builtRight = this.build(obj.right);
				result = new ArithmeticExpression(obj.symbol, builtLeft, builtRight);
				break;
			case 'Conditional' :
				var builtCondition = this.build(obj.condition);
				var builtIfClause = this.build(obj.ifClause);
				var builtElseClause = this.build(obj.elseClause);
				result = new Conditional(builtCondition, builtIfClause, builtElseClause);
				break;
			case 'Comparison' :
				var builtLeft = this.build(obj.left);
				var builtRight = this.build(obj.right);
				result = new Comparison(obj.symbol, builtLeft, builtRight);
				break;
			case 'ArrAccess' :
				var builtIndex = this.build(obj.index);
				result = new ArrAccess(builtIndex);
				break;
			case 'ArrSwap' :
				var builtIndex1 = this.build(obj.index1);
				var builtIndex2 = this.build(obj.index2);
				result = new ArrSwap(builtIndex1, builtIndex2);
				break;
			default :
				result = null;
			}
			if (result != null) {
				result.id = index;
			}
			
			return result;
		},
		
		run : function(block) {
			execCmds = [];
			curCmd = 0;
			swaps = [];
			block.interpret();
			visual = window.setInterval('visualize()', whop.delay);
		}
	}
};

$(document).ready(function() {
	whop.init();
});