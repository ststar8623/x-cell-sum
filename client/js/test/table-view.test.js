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

	describe('table body', () => {
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
	})

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
