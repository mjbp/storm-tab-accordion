/**
 * @name storm-tab-accordion: Tab and accordion ui component for multi-panelled content areas
 * @version 1.3.3: Fri, 09 Mar 2018 17:07:55 GMT
 * @author stormid
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