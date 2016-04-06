var UTILS = require('storm-utils'),
    STORM = (function(w, d) {
	'use strict';
    
    var TabAccordion = require('./libs/TabAccordion'),
        init = function() {
            TabAccordion.init('.js-tab-accordion');
        };
	
	return {
		init: init
	};
	
})(window, document, undefined);

global.UTILS = UTILS;

if('addEventListener' in window) window.addEventListener('DOMContentLoaded', STORM.init, false);