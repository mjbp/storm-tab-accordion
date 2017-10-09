(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _component = require('./libs/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var onDOMContentLoadedTasks = [function () {
  _component2.default.init('.js-tab-accordion');
}];

if ('addEventListener' in window) window.addEventListener('DOMContentLoaded', function () {
  onDOMContentLoadedTasks.forEach(function (fn) {
    return fn();
  });
});

},{"./libs/component":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defaults = require('./lib/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _componentPrototype = require('./lib/component-prototype');

var _componentPrototype2 = _interopRequireDefault(_componentPrototype);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var init = function init(sel, opts) {
	var els = [].slice.call(document.querySelectorAll(sel));

	if (!els.length) throw new Error('Tab Accordion cannot be initialised, no augmentable elements found');

	return els.map(function (el) {
		return Object.assign(Object.create(_componentPrototype2.default), {
			DOMElement: el,
			settings: Object.assign({}, _defaults2.default, el.dataset, opts)
		}).init();
	});
};

exports.default = { init: init };

},{"./lib/component-prototype":3,"./lib/defaults":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var KEY_CODES = {
    SPACE: 32,
    ENTER: 13,
    TAB: 9,
    LEFT: 37,
    RIGHT: 39,
    DOWN: 40
},
    TRIGGER_EVENTS = ['ontouchstart' in window ? 'touchstart' : 'click', 'keydown'];

exports.default = {
    init: function init() {
        var _this = this;

        var hash = location.hash.slice(1) || false;

        this.tabs = [].slice.call(this.DOMElement.querySelectorAll(this.settings.tabClass));
        this.titles = [].slice.call(this.DOMElement.querySelectorAll(this.settings.titleClass));
        this.panels = this.tabs.map(function (el) {
            return document.getElementById(el.getAttribute('href').substr(1)) || console.error('Tab target not found');
        });
        this.current = this.settings.active;

        if (hash !== false) this.panels.forEach(function (target, i) {
            if (target.getAttribute('id') === hash) _this.current = i;
        });

        this.initAttributes();
        this.initTitles();
        this.initTabs();
        this.open(this.current);

        return this;
    },
    initAttributes: function initAttributes() {
        var _this2 = this;

        this.tabs.forEach(function (tab, i) {
            tab.setAttribute('role', 'tab');
            tab.setAttribute('tabindex', 0);
            tab.setAttribute('aria-selected', false);
            tab.setAttribute('tabindex', '-1');
            _this2.panels[i].setAttribute('role', 'tabpanel');
            _this2.panels[i].setAttribute('hidden', 'hidden');
            _this2.panels[i].setAttribute('tabindex', '-1');
            if (!_this2.panels[i].firstElementChild || _this2.panels[i].firstElementChild.hasAttribute('tabindex')) return;
            _this2.panels[i].firstElementChild.setAttribute('tabindex', '-1');
        });
        return this;
    },
    initTitles: function initTitles() {
        var _this3 = this;

        var handler = function handler(i) {
            _this3.toggle(i);
        };

        this.titles.forEach(function (el, i) {
            TRIGGER_EVENTS.forEach(function (ev) {
                el.addEventListener(ev, function (e) {
                    if (e.keyCode && e.keyCode === KEY_CODES.TAB) return;

                    if (!e.keyCode || e.keyCode === KEY_CODES.ENTER || e.keyCode === KEY_CODES.SPACE) {
                        e.preventDefault();
                        handler.call(_this3, i);
                    }
                }, false);
            });
        });

        return this;
    },
    initTabs: function initTabs() {
        var _this4 = this;

        var change = function change(id) {
            _this4.toggle(id);
            window.setTimeout(function () {
                _this4.tabs[_this4.current].focus();
            }, 16);
        },
            nextId = function nextId() {
            return _this4.current === _this4.tabs.length - 1 ? 0 : _this4.current + 1;
        },
            previousId = function previousId() {
            return _this4.current === 0 ? _this4.tabs.length - 1 : _this4.current - 1;
        };

        this.tabs.forEach(function (el, i) {
            el.addEventListener('keydown', function (e) {
                switch (e.keyCode) {
                    case KEY_CODES.LEFT:
                        change.call(_this4, previousId());
                        break;
                    case KEY_CODES.DOWN:
                        e.preventDefault();
                        e.stopPropagation();
                        _this4.panels[i].focus();
                        break;
                    case KEY_CODES.RIGHT:
                        change.call(_this4, nextId());
                        break;
                    case KEY_CODES.ENTER:
                        change.call(_this4, i);
                        break;
                    case KEY_CODES.SPACE:
                        e.preventDefault();
                        change.call(_this4, i);
                        break;
                    default:
                        break;
                }
            });

            el.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                change.call(_this4, i);
            }, false);
        });

        return this;
    },
    change: function change(type, i) {
        this.tabs[i].classList[type === 'open' ? 'add' : 'remove'](this.settings.currentClass);
        this.titles[i].classList[type === 'open' ? 'add' : 'remove'](this.settings.currentClass);
        this.panels[i].classList[type === 'open' ? 'add' : 'remove'](this.settings.currentClass);
        type === 'open' ? this.panels[i].removeAttribute('hidden') : this.panels[i].setAttribute('hidden', 'hidden');
        this.tabs[i].setAttribute('aria-selected', this.tabs[i].getAttribute('aria-selected') === 'true' ? 'false' : 'true');
        (type === 'open' ? this.tabs[i] : this.tabs[this.current]).setAttribute('tabindex', type === 'open' ? '0' : '-1');
        (type === 'open' ? this.panels[i] : this.panels[this.current]).setAttribute('tabindex', type === 'open' ? '0' : '-1');
    },
    open: function open(i) {
        this.change('open', i);
        this.current = i;
        return this;
    },
    close: function close(i) {
        this.change('close', i);
        return this;
    },
    toggle: function toggle(i) {
        if (this.current === i) {
            return;
        }

        !!window.history.pushState && window.history.pushState({ URL: this.tabs[i].getAttribute('href') }, '', this.tabs[i].getAttribute('href'));

        if (this.current === null) this.open(i);else this.close(this.current).open(i);

        return this;
    }
};

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    tabClass: '.js-tab-accordion-tab',
    titleClass: '.js-tab-accordion-title',
    currentClass: 'active',
    active: 0
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ3RDO3NCQUFBLEFBQWEsS0FBYixBQUFrQixBQUNsQjtBQUZELEFBQWdDLENBQUE7O0FBSWhDLElBQUcsc0JBQUgsQUFBeUIsZUFBUSxBQUFPLGlCQUFQLEFBQXdCLG9CQUFvQixZQUFNLEFBQUU7MEJBQUEsQUFBd0IsUUFBUSxVQUFBLEFBQUMsSUFBRDtXQUFBLEFBQVE7QUFBeEMsQUFBZ0Q7QUFBcEcsQ0FBQTs7Ozs7Ozs7O0FDTmpDOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsS0FBRCxBQUFNLE1BQVMsQUFDM0I7S0FBSSxNQUFNLEdBQUEsQUFBRyxNQUFILEFBQVMsS0FBSyxTQUFBLEFBQVMsaUJBQWpDLEFBQVUsQUFBYyxBQUEwQixBQUVsRDs7S0FBRyxDQUFDLElBQUosQUFBUSxRQUFRLE1BQU0sSUFBQSxBQUFJLE1BQVYsQUFBTSxBQUFVLEFBRWhDOztZQUFPLEFBQUksSUFBSSxVQUFBLEFBQUMsSUFBRDtnQkFBUSxBQUFPLE9BQU8sT0FBQSxBQUFPLDRCQUFyQjtlQUFpRCxBQUMxRCxBQUNaO2FBQVUsT0FBQSxBQUFPLE9BQVAsQUFBYyx3QkFBYyxHQUE1QixBQUErQixTQUZwQixBQUFpRCxBQUU1RCxBQUF3QztBQUZvQixBQUN0RSxHQURxQixFQUFSLEFBQVEsQUFHbkI7QUFISixBQUFPLEFBSVAsRUFKTztBQUxSOztrQkFX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QUFJLEtBQUEsQUFBSyxLQUFMLEFBQVUsR0FBVixBQUFhLGFBQXBILEFBQThCLEFBQXlFLEFBQTBCLEFBRWpJOztZQUFHLEtBQUEsQUFBSyxZQUFSLEFBQW9CLE1BQU0sS0FBQSxBQUFLLEtBQS9CLEFBQTBCLEFBQVUsUUFDL0IsS0FBQSxBQUFLLE1BQU0sS0FBWCxBQUFnQixTQUFoQixBQUF5QixLQUF6QixBQUE4QixBQUVuQzs7ZUFBQSxBQUFPLEFBQ1Y7QSxBQXhIVTtBQUFBLEFBQ1g7Ozs7Ozs7OztjQ1hXLEFBQ0QsQUFDVjtnQkFGVyxBQUVDLEFBQ1o7a0JBSFcsQUFHRyxBQUNkO1ksQUFKVyxBQUlIO0FBSkcsQUFDWCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgVGFiQWNjb3JkaW9uIGZyb20gJy4vbGlicy9jb21wb25lbnQnO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG5cdFRhYkFjY29yZGlvbi5pbml0KCcuanMtdGFiLWFjY29yZGlvbicpO1xufV07XG4gICAgXG5pZignYWRkRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93KSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHsgb25ET01Db250ZW50TG9hZGVkVGFza3MuZm9yRWFjaCgoZm4pID0+IGZuKCkpOyB9KTsiLCJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9saWIvZGVmYXVsdHMnO1xuaW1wb3J0IGNvbXBvbmVudFByb3RvdHlwZSBmcm9tICcuL2xpYi9jb21wb25lbnQtcHJvdG90eXBlJztcblxuY29uc3QgaW5pdCA9IChzZWwsIG9wdHMpID0+IHtcblx0bGV0IGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpKTtcblx0XG5cdGlmKCFlbHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ1RhYiBBY2NvcmRpb24gY2Fubm90IGJlIGluaXRpYWxpc2VkLCBubyBhdWdtZW50YWJsZSBlbGVtZW50cyBmb3VuZCcpO1xuXG5cdHJldHVybiBlbHMubWFwKChlbCkgPT4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGNvbXBvbmVudFByb3RvdHlwZSksIHtcblx0XHRcdERPTUVsZW1lbnQ6IGVsLFxuXHRcdFx0c2V0dGluZ3M6IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBlbC5kYXRhc2V0LCBvcHRzKVxuXHRcdH0pLmluaXQoKSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7IGluaXQgfTsiLCJjb25zdCBLRVlfQ09ERVMgPSB7XG4gICAgICAgICAgICBTUEFDRTogMzIsXG4gICAgICAgICAgICBFTlRFUjogMTMsXG4gICAgICAgICAgICBUQUI6IDksXG4gICAgICAgICAgICBMRUZUOiAzNyxcbiAgICAgICAgICAgIFJJR0hUOiAzOSxcbiAgICAgICAgICAgIERPV046IDQwXG4gICAgICAgIH0sXG4gICAgICAgIFRSSUdHRVJfRVZFTlRTID0gWydvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyA/ICd0b3VjaHN0YXJ0JyA6ICdjbGljaycsICdrZXlkb3duJyBdO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgaW5pdCgpIHtcbiAgICAgICAgbGV0IGhhc2ggPSBsb2NhdGlvbi5oYXNoLnNsaWNlKDEpIHx8IGZhbHNlO1xuXG4gICAgICAgIHRoaXMudGFicyA9IFtdLnNsaWNlLmNhbGwodGhpcy5ET01FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5zZXR0aW5ncy50YWJDbGFzcykpO1xuICAgICAgICB0aGlzLnRpdGxlcyA9IFtdLnNsaWNlLmNhbGwodGhpcy5ET01FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5zZXR0aW5ncy50aXRsZUNsYXNzKSk7XG4gICAgICAgIHRoaXMucGFuZWxzID0gdGhpcy50YWJzLm1hcChlbCA9PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5zdWJzdHIoMSkpIHx8IGNvbnNvbGUuZXJyb3IoJ1RhYiB0YXJnZXQgbm90IGZvdW5kJykpO1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLnNldHRpbmdzLmFjdGl2ZTtcblxuICAgICAgICBpZihoYXNoICE9PSBmYWxzZSkgdGhpcy5wYW5lbHMuZm9yRWFjaCgodGFyZ2V0LCBpKSA9PiB7IGlmICh0YXJnZXQuZ2V0QXR0cmlidXRlKCdpZCcpID09PSBoYXNoKSB0aGlzLmN1cnJlbnQgPSBpOyB9KTtcblxuICAgICAgICB0aGlzLmluaXRBdHRyaWJ1dGVzKCk7XG4gICAgICAgIHRoaXMuaW5pdFRpdGxlcygpO1xuICAgICAgICB0aGlzLmluaXRUYWJzKCk7XG4gICAgICAgIHRoaXMub3Blbih0aGlzLmN1cnJlbnQpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaW5pdEF0dHJpYnV0ZXMoKSB7XG4gICAgICAgIHRoaXMudGFicy5mb3JFYWNoKCh0YWIsIGkpID0+IHtcbiAgICAgICAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndGFiJyk7XG4gICAgICAgICAgICB0YWIuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIDApO1xuICAgICAgICAgICAgdGFiLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG4gICAgICAgICAgICB0aGlzLnBhbmVsc1tpXS5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndGFicGFuZWwnKTtcbiAgICAgICAgICAgIHRoaXMucGFuZWxzW2ldLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgJ2hpZGRlbicpO1xuICAgICAgICAgICAgdGhpcy5wYW5lbHNbaV0uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICAgICAgICAgICAgaWYoIXRoaXMucGFuZWxzW2ldLmZpcnN0RWxlbWVudENoaWxkIHx8IHRoaXMucGFuZWxzW2ldLmZpcnN0RWxlbWVudENoaWxkLmhhc0F0dHJpYnV0ZSgndGFiaW5kZXgnKSkgcmV0dXJuO1xuICAgICAgICAgICAgdGhpcy5wYW5lbHNbaV0uZmlyc3RFbGVtZW50Q2hpbGQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBpbml0VGl0bGVzKCkge1xuICAgICAgICBsZXQgaGFuZGxlciA9IGkgPT4geyB0aGlzLnRvZ2dsZShpKTsgfTtcblxuICAgICAgICB0aGlzLnRpdGxlcy5mb3JFYWNoKChlbCwgaSkgPT4ge1xuICAgICAgICAgICAgVFJJR0dFUl9FVkVOVFMuZm9yRWFjaChldiA9PiB7XG4gICAgICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihldiwgZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGUua2V5Q29kZSAmJiBlLmtleUNvZGUgPT09IEtFWV9DT0RFUy5UQUIpIHJldHVybjtcblxuICAgICAgICAgICAgICAgICAgICBpZighZS5rZXlDb2RlIHx8IGUua2V5Q29kZSA9PT0gS0VZX0NPREVTLkVOVEVSIHx8IGUua2V5Q29kZSA9PT0gS0VZX0NPREVTLlNQQUNFKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGluaXRUYWJzKCkge1xuICAgICAgICBsZXQgY2hhbmdlID0gaWQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlKGlkKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IHRoaXMudGFic1t0aGlzLmN1cnJlbnRdLmZvY3VzKCk7IH0sIDE2KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuZXh0SWQgPSAoKSA9PiAodGhpcy5jdXJyZW50ID09PSB0aGlzLnRhYnMubGVuZ3RoIC0gMSA/IDAgOiB0aGlzLmN1cnJlbnQgKyAxKSxcbiAgICAgICAgICAgIHByZXZpb3VzSWQgPSAoKSA9PiAodGhpcy5jdXJyZW50ID09PSAwID8gdGhpcy50YWJzLmxlbmd0aCAtIDEgOiB0aGlzLmN1cnJlbnQgLSAxKTtcblxuICAgICAgICB0aGlzLnRhYnMuZm9yRWFjaCgoZWwsIGkpID0+IHtcbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBlID0+IHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLkxFRlQ6XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZS5jYWxsKHRoaXMsIHByZXZpb3VzSWQoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLkRPV046XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYW5lbHNbaV0uZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuUklHSFQ6XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZS5jYWxsKHRoaXMsIG5leHRJZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuRU5URVI6XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZS5jYWxsKHRoaXMsIGkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5TUEFDRTpcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgaSk7XG4gICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgY2hhbmdlKHR5cGUsIGkpIHtcbiAgICAgICAgdGhpcy50YWJzW2ldLmNsYXNzTGlzdFsodHlwZSA9PT0gJ29wZW4nID8gJ2FkZCcgOiAncmVtb3ZlJyldKHRoaXMuc2V0dGluZ3MuY3VycmVudENsYXNzKTtcbiAgICAgICAgdGhpcy50aXRsZXNbaV0uY2xhc3NMaXN0Wyh0eXBlID09PSAnb3BlbicgPyAnYWRkJyA6ICdyZW1vdmUnKV0odGhpcy5zZXR0aW5ncy5jdXJyZW50Q2xhc3MpO1xuICAgICAgICB0aGlzLnBhbmVsc1tpXS5jbGFzc0xpc3RbKHR5cGUgPT09ICdvcGVuJyA/ICdhZGQnIDogJ3JlbW92ZScpXSh0aGlzLnNldHRpbmdzLmN1cnJlbnRDbGFzcyk7XG4gICAgICAgIHR5cGUgPT09ICdvcGVuJyA/IHRoaXMucGFuZWxzW2ldLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJykgOiB0aGlzLnBhbmVsc1tpXS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICdoaWRkZW4nKTtcbiAgICAgICAgdGhpcy50YWJzW2ldLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIHRoaXMudGFic1tpXS5nZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnKSA9PT0gJ3RydWUnID8gJ2ZhbHNlJyA6ICd0cnVlJyApO1xuICAgICAgICAodHlwZSA9PT0gJ29wZW4nID8gdGhpcy50YWJzW2ldIDogdGhpcy50YWJzW3RoaXMuY3VycmVudF0pLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAodHlwZSA9PT0gJ29wZW4nID8gJzAnIDogJy0xJykpO1xuICAgICAgICAodHlwZSA9PT0gJ29wZW4nID8gdGhpcy5wYW5lbHNbaV0gOiB0aGlzLnBhbmVsc1t0aGlzLmN1cnJlbnRdKS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgKHR5cGUgPT09ICdvcGVuJyA/ICcwJyA6ICctMScpKTtcbiAgICB9LFxuICAgIG9wZW4oaSkge1xuICAgICAgICB0aGlzLmNoYW5nZSgnb3BlbicsIGkpO1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSBpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGNsb3NlKGkpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2UoJ2Nsb3NlJywgaSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgdG9nZ2xlKGkpIHtcbiAgICAgICAgaWYodGhpcy5jdXJyZW50ID09PSBpKSB7IHJldHVybjsgfVxuICAgICAgICBcbiAgICAgICAgISF3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUgJiYgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHsgVVJMOiB0aGlzLnRhYnNbaV0uZ2V0QXR0cmlidXRlKCdocmVmJykgfSwgJycsIHRoaXMudGFic1tpXS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSk7XG5cbiAgICAgICAgaWYodGhpcy5jdXJyZW50ID09PSBudWxsKSB0aGlzLm9wZW4oaSk7XG4gICAgICAgIGVsc2UgdGhpcy5jbG9zZSh0aGlzLmN1cnJlbnQpLm9wZW4oaSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufTsiLCJleHBvcnQgZGVmYXVsdCB7XG4gICAgdGFiQ2xhc3M6ICcuanMtdGFiLWFjY29yZGlvbi10YWInLFxuICAgIHRpdGxlQ2xhc3M6ICcuanMtdGFiLWFjY29yZGlvbi10aXRsZScsXG4gICAgY3VycmVudENsYXNzOiAnYWN0aXZlJyxcbiAgICBhY3RpdmU6IDBcbn07Il19
