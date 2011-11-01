var arr = [];
var vars = {};
var slots = [];
var focus = 0;
var counter = 0;
var curBlock = 0;

var whop = {
	arrLength : 20,
	
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
			$('#listing-container').append('[' + arr.join(', ') + ']');
			$('#listing-container').append('<h4>Program</h4>');
			this.initTools();
			this.initRunTools();
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
				// TODO
			});
		}
	},
	
	listing : {
		render : function() {
			$('#slot-0').remove();
			$('#listing-container').append(this.renderSlot(0));
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
			
			var result = '';
			switch (obj.type) {
			case 'Block' :
				var renderedCmds = [];
				for (var i = 0; i < obj.cmds.length; i++) {
					renderedCmds[i] = this.renderSlot(obj.cmds[i]);
				}
				result = '<div class="block' + focusStr + '" ' + idStr + '>' + renderedCmds.join('') + '</div>';
				break;
			case 'Assignment' :
				var renderedLeft = this.renderSlot(obj.left, true);
				var renderedRight = this.renderSlot(obj.right, true);
				result = '<div class="simple-command' + focusStr + '" ' + idStr + '>' + renderedLeft + ' = ' + renderedRight + '</div>';
				break;
			case 'VarName' :
				result = '<div class="inline-slot' + focusStr + '" ' + idStr + '>' + slots[index].val + '</div>';
				break;
			case 'Literal' :
				result = '<div class="inline-slot' + focusStr + '" ' + idStr + '>' + slots[index].val + '</div>';
				break;
			case 'WhileLoop' :
				var renderedCondition = this.renderSlot(obj.condition, true);
				var renderedBlock = this.renderSlot(obj.block);
				result = '<div class="complex-command' + focusStr + '" ' + idStr + '>' +
					'<div class="command-header">while ' + renderedCondition + '</div>' +
					'<div class="command-body">' + renderedBlock + '</div></div>';
				break;
			case 'ForLoop' :
				var renderedIndex = this.renderSlot(obj.index, true);
				var renderedStart = this.renderSlot(obj.start, true);
				var renderedEnd = this.renderSlot(obj.end, true);
				var renderedBlock = this.renderSlot(obj.block);
				result = '<div class="complex-command' + focusStr + '" ' + idStr + '>' +
					'<div class="command-header">for ' + renderedIndex + ' in ' + renderedStart + ' .. ' + renderedEnd + '</div>' +
					'<div class="command-body">' + renderedBlock + '</div></div>';
				break;
			case 'ArrLast' :
				result = '<div class="inline-slot' + focusStr + '" ' + idStr + '>End of array</div>';
				break;
			case 'Conditional' :
				var renderedCondition = this.renderSlot(obj.condition, true);
				var renderedIfClause = this.renderSlot(obj.ifClause);
				var renderedElseClause = this.renderSlot(obj.elseClause);
				result = '<div class="complex-command' + focusStr + '" ' + idStr + '>' +
					'<div class="command-header">if ' + renderedCondition + '</div>' +
					'<div class="command-body">' + renderedIfClause + '</div>' +
					'<div class="command-header">else</div>' +
					'<div class="command-body">' + renderedElseClause + '</div></div>';
				break;
			case 'Comparison' :
				var renderedLeft = this.renderSlot(obj.left, true);
				var renderedRight = this.renderSlot(obj.right, true);
				result = '<div class="inline-slot">' + renderedLeft + ' ' + obj.symbol + ' ' +
					renderedRight + '</div>';
				break;
			default :
				var classStr = isInline ? 'inline-slot' : 'slot';
				result = '<div class="' + classStr + focusStr + '" ' + idStr + '></div>';
			}
			
			return result;
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
			default:
				console.log('Unknown tool: ' + tool);
			}
			
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
		
		incrementFocus : function() {
			if (slots[++focus].type == 'Block') {
				curBlock = focus;
				
				var cmds = slots[focus].cmds;
				focus = cmds[cmds.length - 1];
			}
		}
	}
};

$(document).ready(function() {
	whop.init();
});