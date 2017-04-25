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
	}

	renderTable(){
		this.renderTableHeader();
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
}

module.exports = TableView;