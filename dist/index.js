/**
 * @name storm-tab-accordion: Tab and accordion ui component for multi-panelled content areas
 * @version 1.2.2: Tue, 12 Sep 2017 16:53:04 GMT
 * @author mjbp
 * @license MIT
 */
import defaults from './lib/defaults';
import componentPrototype from './lib/component-prototype';

const init = (sel, opts) => {
	let els = [].slice.call(document.querySelectorAll(sel));
	
	if(!els.length) throw new Error('Tab Accordion cannot be initialised, no augmentable elements found');

	return els.map((el) => Object.assign(Object.create(componentPrototype), {
			DOMElement: el,
			settings: Object.assign({}, defaults, el.dataset, opts)
		}).init());
};

export default { init };