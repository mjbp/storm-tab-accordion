import should from 'should';
import 'jsdom-global/register';
import TabAccordion from '../dist/storm-tab-accordion.standalone.js';


const html = `<div class="js-tab-accordion">
            <nav role="tablist" class="tab-accordion__nav">
                <a class="js-tab-accordion-tab tab-accordion__nav-link" href="#target-1">Item 1</a>
                <a class="js-tab-accordion-tab tab-accordion__nav-link" href="#target-2">Item 2</a>
            </nav>
            <section id="target-1" class="tab-accordion__section">
                <h1 class="js-tab-accordion-title tab-accordion__title">Item 1</h1>
                <div class="tab-accordion__inner">
					<button></button>
				</div>
            </section>
            <section id="target-2" class="tab-accordion__section">
                <h1 class="js-tab-accordion-title tab-accordion__title">Item 2</h1>
                <div class="tab-accordion__inner">Two</div>
            </section>
        </div>
		<div class="js-tab-accordion-2">
            <nav role="tablist" class="tab-accordion__nav">
                <a class="js-tab-accordion-tab tab-accordion__nav-link" href="#target-3">Item 3</a>
                <a class="js-tab-accordion-tab tab-accordion__nav-link" href="#target-4">Item 4</a>
            </nav>
            <section id="target-3" class="tab-accordion__section">
                <h1 class="js-tab-accordion-title tab-accordion__title">Item 3</h1>
                <div class="tab-accordion__inner">Three</div>
            </section>
            <section id="target-4" class="tab-accordion__section">
                <h1 class="js-tab-accordion-title tab-accordion__title">Item 4</h1>
                <div class="tab-accordion__inner">Four</div>
            </section>
        </div>
		<div class="js-tab-accordion-3">
            <nav role="tablist" class="tab-accordion__nav">
                <a class="js-tab-accordion-tab tab-accordion__nav-link" href="#target-100">Item 100</a>
            </nav>
		</div>`;

document.body.innerHTML = html;

let TabAccordionSet = TabAccordion.init('.js-tab-accordion'),
	TabAccordionSet2 = TabAccordion.init('.js-tab-accordion-2', {
		active: 1
	});

describe('Initialisation', () => {

	it('should return array of tab accordions', () => {
		should(TabAccordionSet)
		.Array()
		.and.have.lengthOf(1);
	});

	
	it('should throw an error if no link elements are found', () => {
		TabAccordion.init.bind(TabAccordion, '.js-err').should.throw();
	});
	
	it('should throw an error if any target elements are not found for each link', () => {
		TabAccordion.init.bind(TabAccordion, '.js-tab-accordion-3').should.throw();
	});
	
	it('each array item should be an object with the correct properties', () => {
		TabAccordionSet[0].should.be.an.instanceOf(Object).and.not.empty();
		TabAccordionSet[0].should.have.property('DOMElement');
		TabAccordionSet[0].should.have.property('settings').Object();
		TabAccordionSet[0].should.have.property('init').Function();
		TabAccordionSet[0].should.have.property('initAria').Function();
		TabAccordionSet[0].should.have.property('initTitles').Function();
    
	});


	it('should initialisation with different settings if different options are passed', () => {
		should(TabAccordionSet2[0].settings.active).not.equal(TabAccordionSet[0].settings.active);
	});
	
	it('should attach the handleClick eventListener to each tab click event to toggle documentElement className', () => {
		TabAccordionSet[0].tabs[0].click();
		Array.from(TabAccordionSet[0].tabs[0].classList).should.containEql('active');
		Array.from(TabAccordionSet[0].targets[0].classList).should.containEql('active');
		TabAccordionSet[0].tabs[1].click();
		Array.from(TabAccordionSet[0].tabs[0].classList).should.not.containEql('active');
		Array.from(TabAccordionSet[0].targets[0].classList).should.not.containEql('active');
	});

	it('should attach the handleClick eventListener to each title click event to toggle documentElement className', () => {
		TabAccordionSet[0].titles[0].click();
		Array.from(TabAccordionSet[0].titles[0].classList).should.containEql('active');
		Array.from(TabAccordionSet[0].targets[0].classList).should.containEql('active');
		TabAccordionSet[0].titles[1].click();
		Array.from(TabAccordionSet[0].titles[0].classList).should.not.containEql('active');
		Array.from(TabAccordionSet[0].targets[0].classList).should.not.containEql('active');
	});
	

	/*
	 * Write what we expect for each of th keyboard interactions
	 */
	it('should attach keydown eventListener to each tab', () => {
		
		console.log(TabAccordionSet[0].tabs[0]);
		//trigger
		TabAccordionSet[0].tabs[0].dispatchEvent(
			new window.KeyboardEvent('keydown', { 
				code : 32,
				keyCode: 32
			})
		);

		let tabDownEvt = new window.KeyboardEvent('keydown', {
			key : 'Tab',
			keyCode: 9
		});


		TabAccordionSet[0].tabs[0].dispatchEvent(
			new window.KeyboardEvent('keydown', { 
				code : 13,
				keyCode: 13
			})
		);

		TabAccordionSet[0].tabs[0].click();

		TabAccordionSet[0].tabs[0].dispatchEvent(tabDownEvt);

		//TabAccordionSet[0].focusableChildren[0].dispatchEvent(tabDownEvt);

		TabAccordionSet[0].tabs[0].dispatchEvent(
			new window.KeyboardEvent('keydown', { 
				key : 'Tab',
				keyCode: 9,
				shiftKey: true
			})
		);

		TabAccordionSet[0].tabs[0].dispatchEvent(
			new window.KeyboardEvent('keydown', { 
				code : 13,
				keyCode: 13
			})
		);

		TabAccordionSet[0].tabs[0].dispatchEvent(
			new window.KeyboardEvent('keydown', { 
				code : 37,
				keyCode: 37
			})
		);
		
		TabAccordionSet[0].tabs[0].dispatchEvent(
			new window.KeyboardEvent('keydown', { 
				code : 39,
				keyCode: 39
			})
		);

		TabAccordionSet[0].tabs[0].dispatchEvent(
			new window.KeyboardEvent('keydown', { 
				code : 38,
				keyCode: 38
			})
		);

		TabAccordionSet[0].tabs[0].dispatchEvent(
			new window.KeyboardEvent('keydown', { 
				code : 40,
				keyCode: 40
			})
		);
		
	});

});