var UTILS = {
		merge: require('object-assign'),
		assign: require('merge'),
		attributelist: require('storm-attributelist'),
		classlist: require('dom-classlist')
	},
	UI = (function(w, d) {
		'use strict';

		var TabAccordion = require('./libs/storm-tab-accordion'),
			init = function() {
				TabAccordion.init('.js-tab-accordion');
			};

		return {
			init: init
		};

	})(window, document, undefined);

global.STORM = {
    UTILS: UTILS,
    UI: UI
};

if('addEventListener' in window) window.addEventListener('DOMContentLoaded', STORM.UI.init, false);