(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ3RDO3NCQUFBLEFBQWEsS0FBYixBQUFrQixBQUNsQjtBQUZELEFBQWdDLENBQUE7O0FBSWhDLElBQUcsc0JBQUgsQUFBeUIsZUFBUSxBQUFPLGlCQUFQLEFBQXdCLG9CQUFvQixZQUFNLEFBQUU7MEJBQUEsQUFBd0IsUUFBUSxVQUFBLEFBQUMsSUFBRDtXQUFBLEFBQVE7QUFBeEMsQUFBZ0Q7QUFBcEcsQ0FBQTs7Ozs7Ozs7O0FDTmpDOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsS0FBRCxBQUFNLE1BQVMsQUFDM0I7S0FBSSxNQUFNLEdBQUEsQUFBRyxNQUFILEFBQVMsS0FBSyxTQUFBLEFBQVMsaUJBQWpDLEFBQVUsQUFBYyxBQUEwQixBQUVsRDs7S0FBRyxDQUFDLElBQUosQUFBUSxRQUFRLE1BQU0sSUFBQSxBQUFJLE1BQVYsQUFBTSxBQUFVLEFBRWhDOztZQUFPLEFBQUksSUFBSSxVQUFBLEFBQUMsSUFBRDtnQkFBUSxBQUFPLE9BQU8sT0FBQSxBQUFPLDRCQUFyQjtlQUFpRCxBQUMxRCxBQUNaO2FBQVUsT0FBQSxBQUFPLE9BQVAsQUFBYyx3QkFBYyxHQUE1QixBQUErQixTQUZwQixBQUFpRCxBQUU1RCxBQUF3QztBQUZvQixBQUN0RSxHQURxQixFQUFSLEFBQVEsQUFHbkI7QUFISixBQUFPLEFBSVAsRUFKTztBQUxSOztrQkFX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QUFJLEtBQUEsQUFBSyxLQUFMLEFBQVUsR0FBVixBQUFhLGFBQXBILEFBQThCLEFBQXlFLEFBQTBCLEFBRWpJOztZQUFHLEtBQUEsQUFBSyxZQUFSLEFBQW9CLE1BQU0sS0FBQSxBQUFLLEtBQS9CLEFBQTBCLEFBQVUsUUFDL0IsS0FBQSxBQUFLLE1BQU0sS0FBWCxBQUFnQixTQUFoQixBQUF5QixLQUF6QixBQUE4QixBQUVuQzs7ZUFBQSxBQUFPLEFBQ1Y7QSxBQXhIVTtBQUFBLEFBQ1g7Ozs7Ozs7OztjQ1hXLEFBQ0QsQUFDVjtnQkFGVyxBQUVDLEFBQ1o7a0JBSFcsQUFHRyxBQUNkO1ksQUFKVyxBQUlIO0FBSkcsQUFDWCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9cmV0dXJuIGV9KSgpIiwiaW1wb3J0IFRhYkFjY29yZGlvbiBmcm9tICcuL2xpYnMvY29tcG9uZW50JztcblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkVGFza3MgPSBbKCkgPT4ge1xuXHRUYWJBY2NvcmRpb24uaW5pdCgnLmpzLXRhYi1hY2NvcmRpb24nKTtcbn1dO1xuICAgIFxuaWYoJ2FkZEV2ZW50TGlzdGVuZXInIGluIHdpbmRvdykgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSk7IiwiaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4vbGliL2RlZmF1bHRzJztcbmltcG9ydCBjb21wb25lbnRQcm90b3R5cGUgZnJvbSAnLi9saWIvY29tcG9uZW50LXByb3RvdHlwZSc7XG5cbmNvbnN0IGluaXQgPSAoc2VsLCBvcHRzKSA9PiB7XG5cdGxldCBlbHMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKSk7XG5cdFxuXHRpZighZWxzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCdUYWIgQWNjb3JkaW9uIGNhbm5vdCBiZSBpbml0aWFsaXNlZCwgbm8gYXVnbWVudGFibGUgZWxlbWVudHMgZm91bmQnKTtcblxuXHRyZXR1cm4gZWxzLm1hcCgoZWwpID0+IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShjb21wb25lbnRQcm90b3R5cGUpLCB7XG5cdFx0XHRET01FbGVtZW50OiBlbCxcblx0XHRcdHNldHRpbmdzOiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgZWwuZGF0YXNldCwgb3B0cylcblx0XHR9KS5pbml0KCkpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgeyBpbml0IH07IiwiY29uc3QgS0VZX0NPREVTID0ge1xuICAgICAgICAgICAgU1BBQ0U6IDMyLFxuICAgICAgICAgICAgRU5URVI6IDEzLFxuICAgICAgICAgICAgVEFCOiA5LFxuICAgICAgICAgICAgTEVGVDogMzcsXG4gICAgICAgICAgICBSSUdIVDogMzksXG4gICAgICAgICAgICBET1dOOiA0MFxuICAgICAgICB9LFxuICAgICAgICBUUklHR0VSX0VWRU5UUyA9IFsnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgPyAndG91Y2hzdGFydCcgOiAnY2xpY2snLCAna2V5ZG93bicgXTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGluaXQoKSB7XG4gICAgICAgIGxldCBoYXNoID0gbG9jYXRpb24uaGFzaC5zbGljZSgxKSB8fCBmYWxzZTtcblxuICAgICAgICB0aGlzLnRhYnMgPSBbXS5zbGljZS5jYWxsKHRoaXMuRE9NRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuc2V0dGluZ3MudGFiQ2xhc3MpKTtcbiAgICAgICAgdGhpcy50aXRsZXMgPSBbXS5zbGljZS5jYWxsKHRoaXMuRE9NRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuc2V0dGluZ3MudGl0bGVDbGFzcykpO1xuICAgICAgICB0aGlzLnBhbmVscyA9IHRoaXMudGFicy5tYXAoZWwgPT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWwuZ2V0QXR0cmlidXRlKCdocmVmJykuc3Vic3RyKDEpKSB8fCBjb25zb2xlLmVycm9yKCdUYWIgdGFyZ2V0IG5vdCBmb3VuZCcpKTtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5zZXR0aW5ncy5hY3RpdmU7XG5cbiAgICAgICAgaWYoaGFzaCAhPT0gZmFsc2UpIHRoaXMucGFuZWxzLmZvckVhY2goKHRhcmdldCwgaSkgPT4geyBpZiAodGFyZ2V0LmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gaGFzaCkgdGhpcy5jdXJyZW50ID0gaTsgfSk7XG5cbiAgICAgICAgdGhpcy5pbml0QXR0cmlidXRlcygpO1xuICAgICAgICB0aGlzLmluaXRUaXRsZXMoKTtcbiAgICAgICAgdGhpcy5pbml0VGFicygpO1xuICAgICAgICB0aGlzLm9wZW4odGhpcy5jdXJyZW50KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGluaXRBdHRyaWJ1dGVzKCkge1xuICAgICAgICB0aGlzLnRhYnMuZm9yRWFjaCgodGFiLCBpKSA9PiB7XG4gICAgICAgICAgICB0YWIuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYicpO1xuICAgICAgICAgICAgdGFiLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAwKTtcbiAgICAgICAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICB0YWIuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICAgICAgICAgICAgdGhpcy5wYW5lbHNbaV0uc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYnBhbmVsJyk7XG4gICAgICAgICAgICB0aGlzLnBhbmVsc1tpXS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICdoaWRkZW4nKTtcbiAgICAgICAgICAgIHRoaXMucGFuZWxzW2ldLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICAgICAgICAgIGlmKCF0aGlzLnBhbmVsc1tpXS5maXJzdEVsZW1lbnRDaGlsZCB8fCB0aGlzLnBhbmVsc1tpXS5maXJzdEVsZW1lbnRDaGlsZC5oYXNBdHRyaWJ1dGUoJ3RhYmluZGV4JykpIHJldHVybjtcbiAgICAgICAgICAgIHRoaXMucGFuZWxzW2ldLmZpcnN0RWxlbWVudENoaWxkLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaW5pdFRpdGxlcygpIHtcbiAgICAgICAgbGV0IGhhbmRsZXIgPSBpID0+IHsgdGhpcy50b2dnbGUoaSk7IH07XG5cbiAgICAgICAgdGhpcy50aXRsZXMuZm9yRWFjaCgoZWwsIGkpID0+IHtcbiAgICAgICAgICAgIFRSSUdHRVJfRVZFTlRTLmZvckVhY2goZXYgPT4ge1xuICAgICAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXYsIGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZihlLmtleUNvZGUgJiYgZS5rZXlDb2RlID09PSBLRVlfQ09ERVMuVEFCKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoIWUua2V5Q29kZSB8fCBlLmtleUNvZGUgPT09IEtFWV9DT0RFUy5FTlRFUiB8fCBlLmtleUNvZGUgPT09IEtFWV9DT0RFUy5TUEFDRSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgaSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBpbml0VGFicygpIHtcbiAgICAgICAgbGV0IGNoYW5nZSA9IGlkID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZShpZCk7XG4gICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnRhYnNbdGhpcy5jdXJyZW50XS5mb2N1cygpOyB9LCAxNik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmV4dElkID0gKCkgPT4gKHRoaXMuY3VycmVudCA9PT0gdGhpcy50YWJzLmxlbmd0aCAtIDEgPyAwIDogdGhpcy5jdXJyZW50ICsgMSksXG4gICAgICAgICAgICBwcmV2aW91c0lkID0gKCkgPT4gKHRoaXMuY3VycmVudCA9PT0gMCA/IHRoaXMudGFicy5sZW5ndGggLSAxIDogdGhpcy5jdXJyZW50IC0gMSk7XG5cbiAgICAgICAgdGhpcy50YWJzLmZvckVhY2goKGVsLCBpKSA9PiB7XG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZSA9PiB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5MRUZUOlxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBwcmV2aW91c0lkKCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5ET1dOOlxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFuZWxzW2ldLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLlJJR0hUOlxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBuZXh0SWQoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLkVOVEVSOlxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuU1BBQ0U6XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgaSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGNoYW5nZS5jYWxsKHRoaXMsIGkpO1xuICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGNoYW5nZSh0eXBlLCBpKSB7XG4gICAgICAgIHRoaXMudGFic1tpXS5jbGFzc0xpc3RbKHR5cGUgPT09ICdvcGVuJyA/ICdhZGQnIDogJ3JlbW92ZScpXSh0aGlzLnNldHRpbmdzLmN1cnJlbnRDbGFzcyk7XG4gICAgICAgIHRoaXMudGl0bGVzW2ldLmNsYXNzTGlzdFsodHlwZSA9PT0gJ29wZW4nID8gJ2FkZCcgOiAncmVtb3ZlJyldKHRoaXMuc2V0dGluZ3MuY3VycmVudENsYXNzKTtcbiAgICAgICAgdGhpcy5wYW5lbHNbaV0uY2xhc3NMaXN0Wyh0eXBlID09PSAnb3BlbicgPyAnYWRkJyA6ICdyZW1vdmUnKV0odGhpcy5zZXR0aW5ncy5jdXJyZW50Q2xhc3MpO1xuICAgICAgICB0eXBlID09PSAnb3BlbicgPyB0aGlzLnBhbmVsc1tpXS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpIDogdGhpcy5wYW5lbHNbaV0uc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnaGlkZGVuJyk7XG4gICAgICAgIHRoaXMudGFic1tpXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCB0aGlzLnRhYnNbaV0uZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJyA/ICdmYWxzZScgOiAndHJ1ZScgKTtcbiAgICAgICAgKHR5cGUgPT09ICdvcGVuJyA/IHRoaXMudGFic1tpXSA6IHRoaXMudGFic1t0aGlzLmN1cnJlbnRdKS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgKHR5cGUgPT09ICdvcGVuJyA/ICcwJyA6ICctMScpKTtcbiAgICAgICAgKHR5cGUgPT09ICdvcGVuJyA/IHRoaXMucGFuZWxzW2ldIDogdGhpcy5wYW5lbHNbdGhpcy5jdXJyZW50XSkuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICh0eXBlID09PSAnb3BlbicgPyAnMCcgOiAnLTEnKSk7XG4gICAgfSxcbiAgICBvcGVuKGkpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2UoJ29wZW4nLCBpKTtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gaTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjbG9zZShpKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlKCdjbG9zZScsIGkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHRvZ2dsZShpKSB7XG4gICAgICAgIGlmKHRoaXMuY3VycmVudCA9PT0gaSkgeyByZXR1cm47IH1cbiAgICAgICAgXG4gICAgICAgICEhd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlICYmIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7IFVSTDogdGhpcy50YWJzW2ldLmdldEF0dHJpYnV0ZSgnaHJlZicpIH0sICcnLCB0aGlzLnRhYnNbaV0uZ2V0QXR0cmlidXRlKCdocmVmJykpO1xuXG4gICAgICAgIGlmKHRoaXMuY3VycmVudCA9PT0gbnVsbCkgdGhpcy5vcGVuKGkpO1xuICAgICAgICBlbHNlIHRoaXMuY2xvc2UodGhpcy5jdXJyZW50KS5vcGVuKGkpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIHRhYkNsYXNzOiAnLmpzLXRhYi1hY2NvcmRpb24tdGFiJyxcbiAgICB0aXRsZUNsYXNzOiAnLmpzLXRhYi1hY2NvcmRpb24tdGl0bGUnLFxuICAgIGN1cnJlbnRDbGFzczogJ2FjdGl2ZScsXG4gICAgYWN0aXZlOiAwXG59OyJdfQ==
