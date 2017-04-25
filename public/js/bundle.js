(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const TableModel = require('./table-model');
const TableView = require('./table-view');

const model = new TableModel();
const tableView = new TableView(model);
tableView.init();
},{"./table-model":4,"./table-view":5}],2:[function(require,module,exports){
const getRange = function(fromNum, toNum){
	return Array.from({length: toNum - fromNum + 1},
		(unused, i) => i + fromNum);
};

const getLetterRange = function(firstLetter = 'A', numLetters){
	const rangeStart = firstLetter.charCodeAt(0);
	const rangeEnd = rangeStart + numLetters - 1;
	return getRange(rangeStart, rangeEnd)
			.map(charCode => String.fromCharCode(charCode));
};

module.exports = {
	getRange: getRange,
	getLetterRange: getLetterRange
};
},{}],3:[function(require,module,exports){
const removeChildren = function(parentEl){
	while(parentEl.firstChild){
		parentEl.removeChild(parentEl.firstChild);
	}
};

const createEl = function(tagName){
	return function(text, ID){
		const el = document.createElement(tagName);
		if(text){
			el.textContent = text;
		}
		if(ID){
			el.id = ID;
		}
		return el;
	};
};

const createTR = createEl('TR');
const createTH = createEl('TH');
const createTD = createEl('TD');

module.exports = {
	createTR: createTR,
	createTH: createTH,
	createTD: createTD,
	removeChildren: removeChildren
}
},{}],4:[function(require,module,exports){
class TableModel {
	constructor(numCols=10, numRows=20){
		this.numCols = numCols;
		this.numRows = numRows;
		this.data = {};
	}

	_getCellId(location){
		return `${location.col}:${location.row}`;
	}

	getValue(location){
		return this.data[this._getCellId(location)];
	}

	setValue(location, value){
		this.data[this._getCellId(location)] = value;
	}
}

module.exports = TableModel;
},{}],5:[function(require,module,exports){
const { getLetterRange } = require('./array-util');
const { removeChildren, createTH, createTR, createTD } = require('./dom-util');

class TableView {
	constructor(model){
		this.model = model;
	}

	init(){
		this.initDomReference();
		this.renderTable();
	}

	initDomReference(){
		this.headerRowEl = document.querySelector('THEAD TR');
		this.sheetBodyEl = document.querySelector('TBODY');
		this.sumRowEl = document.querySelector('TFOOT TR');
	}

	renderTable(){
		this.renderTableHeader();
		this.renderTableBody();
		this.renderTableFoot();
	}

	renderTableHeader(){
		removeChildren(this.headerRowEl);
		getLetterRange('A', this.model.numCols)
			.map(function(label){
				let id = label + 0;
				return createTH(label, id);
			})
			.forEach(th => this.headerRowEl.appendChild(th));
	}

	renderTableBody(){
		const fragment = document.createDocumentFragment();
		for(let row = 0; row < this.model.numRows; row++){
			const tr = createTR(null, row + 1);
			for(let col = 0; col < this.model.numCols; col++){
				const position = {col: col, row: row};
				const value = this.model.getValue(position);

				// convert index number to letter number
				let num = col + 65;
				// turn letter number into letter
				let letter = String.fromCharCode(num);
				// attach letter + row number to ID
				let id = letter + (row + 1);
				// generate TD element with ID
				const td = createTD(value, id);
				// append TD element to TR element
				tr.appendChild(td);
			}
			fragment.appendChild(tr);
		}
		removeChildren(this.sheetBodyEl);
		this.sheetBodyEl.appendChild(fragment);
	}

	renderTableFoot(){
		removeChildren(this.sumRowEl);
		getLetterRange('A', this.model.numCols)
			.map(function(label){
				let id = label;
				return createTD(null, id);
			})
			.forEach(td => this.sumRowEl.appendChild(td));
	}
}

module.exports = TableView;
},{"./array-util":2,"./dom-util":3}]},{},[1]);
