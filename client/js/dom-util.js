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