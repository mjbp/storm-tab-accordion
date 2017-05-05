import defaults from './lib/defaults';
import componentPrototype from './lib/component-prototype';

const init = (sel, opts) => {
	let els = [].slice.call(document.querySelectorAll(sel));
	
	if(!els.length) throw new Error('Tab Accordion cannot be initialised, no augmentable elements found');

	return els.map((el) => {
		return Object.assign(Object.create(componentPrototype), {
			DOMElement: el,
			settings: Object.assign({}, defaults, opts)
		}).init();
	});
};

export default { init };