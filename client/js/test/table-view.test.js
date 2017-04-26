const fs = require('fs');
const TableModel = require('../table-model');
const TableView = require('../table-view');

describe('table-view', () => {

	beforeEach(() => {
		// load html skeleton from disk and parse into the DOM
		const fixturePath = './client/js/test/fixtures/sheet-container.html';
		const html = fs.readFileSync(fixturePath, 'utf8');
		document.documentElement.innerHTML = html;
	});

	describe('formula-bar', () => {
		it('makes changes TO the value of the current cell', () => {
			// set up the initial state
			const model = new TableModel(3, 3);
			const view = new TableView(model);
			view.init();

			// inspect the initial state
			let trs = document.querySelectorAll('TBODY TR');
			let td = trs[0].cells[0];
			expect(td.textContent).toBe('');

			// simulate user action
			document.querySelector('#formula-bar').value = '65';
			view.handleFormulaBarChange();

			// inspect the resulting state
			trs = document.querySelectorAll('TBODY TR');
			expect(trs[0].cells[0].textContent).toBe('65');
		});

		it('updates FROM the value of the current cell', () => {
			// set up the initial state
			const model = new TableModel(3, 3);
			const view = new TableView(model);
			model.setValue({col: 2, row: 1}, '123');
			view.init();

			// inspect the initial state
			const formulaBarEl = document.querySelector('#formula-bar');
			expect(formulaBarEl.value).toBe('');

			// simulate user action
			const trs = document.querySelectorAll('TBODY TR');
			trs[1].cells[2].click();

			// inspect the resulting state
			expect(formulaBarEl.value).toBe('123');
		});
	});

	describe('table foot', () => {
		it('has the right size', () => {
			// set up initial state
			const numCols = 6;
			const numRows = 10
			const model = new TableModel(numCols, numRows);
			const view = new TableView(model);
			view.init();

			// inspect the initial state
			let tfs = document.querySelectorAll('TFOOT TD');
			expect(tfs.length).toBe(numCols);
		});

		// it('display sum', () => {
		// 	// set up initial state
		// 	const model = new TableModel(5, 10);
		// 	const view = new TableView(model);
		// 	model.setValue({col: 0, row: 0}, '123');
		// 	model.setValue({col: 0, row: 1}, '456');
		// 	view.init();

		// 	// inspect the initial state
		// 	let trs = document.querySelectorAll('TBODY TR');
		// 	let td = trs[0].cells[3];

		// 	// simulate user action
		// 	td.click();

		// 	// inspect the resulting state
		// 	let tfs = document.querySelectorAll('TFOOT TR');
		// 	t = tfs[0].cells[0];
		// 	console.log(t);
		// 	expect(t.textContent).toBe('579');

		// });
	});

	describe('table body', () => {
		it('highligths the current cell when clicked', () =>{
			// set up the initial state
			const model = new TableModel(10,5);
			const view = new TableView(model);
			view.init();

			// inspect the initial state
			let trs = document.querySelectorAll('TBODY TR');
			let td = trs[2].cells[3];
			expect(td.className).toBe('');

			// simulate user action
			td.click();

			// inspect the resulting state
			trs = document.querySelectorAll('TBODY TR');
			td = trs[2].cells[3];
			expect(td.className).not.toBe('');
		});


		it('has the right size', () => {
			// set up initial state
			const numCols = 6;
			const numRows = 10;
			const model = new TableModel(numCols, numRows);
			const view = new TableView(model);
			view.init();

			//inspect the initial state
			let ths = document.querySelectorAll('THEAD TH');
			expect(ths.length).toBe(numCols);
		});

		it('fills in values from the model', () => {
			// set up the initial state
			const model = new TableModel(3,3);
			const view = new TableView(model);
			model.setValue({col: 2, row: 1}, '123');
			view.init();

			// inspect the initial state
			const trs = document.querySelectorAll('TBODY TR');
			expect(trs[1].cells[2].textContent).toBe('123');
		});
	});

	describe('table header', () => {
		it('has valid column header labels', () => {
			// set up initial state
			const numCols = 6;
			const numRows = 10;
			const model = new TableModel(numCols, numRows);
			const view = new TableView(model);
			view.init();

			// inspect initial state
			let ths = document.querySelectorAll('THEAD TH');
			expect(ths.length).toBe(numCols);

			let labelTexts = Array.from(ths).map(el => el.textContent);
			expect(labelTexts).toEqual(['A','B','C','D','E','F']);
		});
	});
});
