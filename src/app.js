import TabAccordion from './libs/storm-tab-accordion';

const onDOMContentLoadedTasks = [() => {
	TabAccordion.init('.js-tab-accordion');
}];
    
if('addEventListener' in window) window.addEventListener('DOMContentLoaded', () => { onDOMContentLoadedTasks.forEach((fn) => fn()); });