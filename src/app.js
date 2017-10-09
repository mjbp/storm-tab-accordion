import TabAccordion from './libs/component';

const onDOMContentLoadedTasks = [() => {
	TabAccordion.init('.js-tab-accordion');
}];
    
if('addEventListener' in window) window.addEventListener('DOMContentLoaded', () => { onDOMContentLoadedTasks.forEach((fn) => fn()); });