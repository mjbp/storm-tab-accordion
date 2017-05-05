/**
 * @name storm-tab-accordion: Tab and accordion ui component for multi-panelled content areas
 * @version 1.0.1: Fri, 05 May 2017 12:11:06 GMT
 * @author mjbp
 * @license MIT
 */
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