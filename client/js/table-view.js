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