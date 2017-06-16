# Storm Tab Accordion

[![Build Status](https://travis-ci.org/mjbp/storm-tab-accordion.svg?branch=master)](https://travis-ci.org/mjbp/storm-tab-accordion)
[![codecov.io](http://codecov.io/github/mjbp/storm-tab-accordion/coverage.svg?branch=master)](http://codecov.io/github/mjbp/storm-tab-accordion?branch=master)
[![npm version](https://badge.fury.io/js/storm-tab-accordion.svg)](https://badge.fury.io/js/storm-tab-accordion)

Tab and accordion ui component for multi-panelled content areas 


## Example
[https://mjbp.github.io/storm-tab-accordion](https://mjbp.github.io/storm-tab-accordion)

## Usage
HTML
```
<div class="js-tab-accordion">
    <nav role="tablist" class="tab-accordion__tabs">
        <a class="js-tab-accordion-tab" href="#target-1">Item 1</a>
        <a class="js-tab-accordion-tab" href="#target-2">Item 2</a>
        <a class="js-tab-accordion-tab" href="#target-3">Item 3</a>
    </nav>
    <section class="tab-accordion__section">
        <h1 tabindex="0" class="js-tab-accordion-title tab-accordion__title">Item 1</h1>
        <div id="target-1" class="tab-accordion__inner">One</div>
    </section>
    <section class="tab-accordion__section">
        <h1 tabindex="0" class="js-tab-accordion-title tab-accordion__title">Item 2</h1>
        <div id="target-2" class="tab-accordion__inner">Two</div>
    </section>
    <section class="tab-accordion__section">
        <h1 tabindex="0" class="js-tab-accordion-title tab-accordion__title">Item 3</h1>
        <div id="target-3" class="tab-accordion__inner">Three</div>
    </section>
</div>
```

JS
```
npm i -S storm-tab-accordion
```
either using es6 import
```
import TabAccordion from 'storm-tab-accordion';

TabAccordion.init('.js-tab-accordion');
```
aynchronous browser loading (use the .standalone version in the /dist folder)
```
import Load from 'storm-load';

Load('/content/js/async/storm-tab-accordion.standalone.js')
    .then(() => {
        StormTabAccordion.init('.js-tab-accordion');
    });
```

CSS
Sample minimum CSS required to show/hide each section

```
.tab-accordion__nav {
    display:none;
}
.tab-accordion__inner {
    position: absolute;
    clip: rect(0, 0, 0, 0);
    visibility: hidden;
}
.tab-accordion__title.active {
    background-color:#eee;
}
.tab-accordion__inner.active {
    position: relative;
    clip:auto;
    padding:2rem;
    background-color:#eee;
    visibility: visible;
}

@media(min-width:768px){
    .tab-accordion__title {
        display:none;
    }
    .tab-accordion__nav {
        display:block;
        overflow: hidden;
    }
    .tab-accordion__section.active {
        position: relative;
        clip:auto;
        padding:2rem;
        background:#eee;
        visibility: visible;
    }
    .tab-accordion__section.active .tab-accordion__inner {
        background:#eee;
    }
}

.tab-accordion__inner {
    max-height:0;
    overflow:hidden;
    clear:both;
}
.tab-accordion__inner.active {
    max-height:10000px;
}
```

## Options
```
    {
		tabClass: '.js-tab-accordion-tab',
        titleClass: '.js-tab-accordion-title',
        currentClass: 'active',
        active: 0
    }
```

e.g.
```
TabAccordion.init('.js-tab-accordion');
```


## Tests
```
npm run test
```

## Browser support
This is module has both es6 and es5 distributions. The es6 version should be used in a workflow that transpiles.

This module depends upon Object.assign, element.classList, and Promises, available in all evergreen browsers. ie9+ is supported with polyfills, ie8+ will work with even more polyfills for Array functions and eventListeners.

## Dependencies
None

## License
MIT