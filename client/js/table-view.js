const { getLetterRange } = require('./array-util');
const { removeChildren, createTH, createTR, createTD } = require('./dom-util');

class TableView {
	constructor(model){
		this.model = model;
	}

	init(){
		this.initDomReference();
		this.initCurrentCell();
		this.renderTable();
		this.attachEventHandlers();
	}

	initDomReference(){
		this.headerRowEl = document.querySelector('THEAD TR');
		this.sheetBodyEl = document.querySelector('TBODY');
		this.sumRowEl = document.querySelector('TFOOT TR');
		this.formulaBarEl = document.querySelector('#formula-bar');
		this.addRowButton = document.getElementById('add-row');
		this.addColumnButton = document.getElementById('add-column');
	}

	initCurrentCell(){
		this.currentCellLocation = {col: 0, row: 0};
		this.renderFormulaBar();
	}

	normalizeValueForRendering(value){
		return value || '';
	}

	renderFormulaBar(){
		const currentCellValue = this.model.getValue(this.currentCellLocation);
		this.formulaBarEl.value = this.normalizeValueForRendering(currentCellValue);
		this.formulaBarEl.focus();
	}

	renderTable(){
		this.renderTableHeader();
		this.renderTableBody();
		this.renderTableFoot();
	}

	renderTableHeader(){
		removeChildren(this.headerRowEl);
		getLetterRange('A', this.model.numCols)
			.map(colLabel => createTH(colLabel))
			.forEach(th => this.headerRowEl.appendChild(th));
	}

	isCurrentCell(col, row){
		return this.currentCellLocation.col === col &&
				this.currentCellLocation.row === row;
	}

	addRow(event){
		event.preventDefault();
		// add a row when button is clicked
		this.model.numRows++;
		// re-render tableBody
		this.renderTableBody();
	}

	addColumn(event){
		event.preventDefault();
		// add a column when button is clicked
		this.model.numCols++;
		// re-render tableBody and tableHeader
		this.renderTableBody();
		this.renderTableHeader();

		// create table data cell and append to sum row
		const tds = createTD();
		this.sumRowEl.append(tds);
	}

	attachEventHandlers(){
		this.sheetBodyEl.addEventListener('click', this.handleSheetClick.bind(this));
		this.formulaBarEl.addEventListener('keyup', this.handleFormulaBarChange.bind(this));
		this.addRowButton.addEventListener('click', this.addRow.bind(this));
		this.addColumnButton.addEventListener('click', this.addColumn.bind(this));
	}

	renderTableBody(){
		const fragment = document.createDocumentFragment();
		for(let row = 0; row < this.model.numRows; row++){
			const tr = createTR();
			for(let col = 0; col < this.model.numCols; col++){
				const position = {col: col, row: row};
				const value = this.model.getValue(position);
				const td = createTD(value);

				if(this.isCurrentCell(col, row)){
					td.className = "current-cell";
				}
				// append TD element to TR element
				tr.appendChild(td);
			}
			fragment.appendChild(tr);
		}
		removeChildren(this.sheetBodyEl);
		this.sheetBodyEl.appendChild(fragment);
	}

	// generate TD for sum row and append to tfoot
	renderTableFoot(){
		removeChildren(this.sumRowEl);
		for(let col = 0; col < this.model.numCols; col++){
			const td = createTD();
			this.sumRowEl.appendChild(td);
		}
	}

	handleSumRowChange(location){
		// grab all value from each column by their cell indexes
		const arr = Array.from(document.querySelectorAll('TBODY TD')).filter(el => el.cellIndex === location.col).map(el => el.innerText).filter(el => el).filter(el => el == Number(el));

		let total;
		// generate sum
		// if arr has no value, set it to '' incase undefined is shown
		if(arr.length === 0){
			total = '';
		} else {
			total = arr.reduce((a,b) => parseInt(a) + parseInt(b));
		}

		// grab sum cell by the index
		const sumCell = Array.from(document.querySelectorAll('TFOOT TR TD')).filter(el => el.cellIndex === location.col);

		// set sum cell as total value
		sumCell[0].innerText = total;
	}

	handleFormulaBarChange(evt){
		const value = this.formulaBarEl.value;
		this.model.setValue(this.currentCellLocation, value);
		this.renderTableBody();
		this.handleSumRowChange(this.currentCellLocation);
	}

	handleSheetClick(evt){
		const col = evt.target.cellIndex;
		const row = evt.target.parentElement.rowIndex - 1;

		this.currentCellLocation = { col: col, row: row };
		this.renderTableBody();
		this.renderFormulaBar();
	}
}

module.exports = TableView;