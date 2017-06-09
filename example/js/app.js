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
    UP: 38,
    DOWN: 40
},
    TRIGGER_EVENTS = [window.PointerEvent ? 'pointerdown' : 'ontouchstart' in window ? 'touchstart' : 'click', 'keydown'];

exports.default = {
    init: function init() {
        var _this = this;

        var hash = location.hash.slice(1) || false;

        this.tabs = [].slice.call(this.DOMElement.querySelectorAll(this.settings.tabClass));
        this.titles = [].slice.call(this.DOMElement.querySelectorAll(this.settings.titleClass));
        this.targets = this.tabs.map(function (el) {
            return document.getElementById(el.getAttribute('href').substr(1)) || console.error('Tab target not found');
        });
        this.current = this.settings.active;

        if (hash !== false) this.targets.forEach(function (target, i) {
            if (target.getAttribute('id') === hash) _this.current = i;
        });

        this.initAria();
        this.initTitles();
        this.initTabs();
        this.open(this.current);

        return this;
    },
    initAria: function initAria() {
        var _this2 = this;

        this.tabs.forEach(function (el, i) {
            el.setAttribute('role', 'tab');
            el.setAttribute('tabIndex', 0);
            el.setAttribute('aria-expanded', false);
            el.setAttribute('aria-selected', false);
            el.setAttribute('aria-controls', el.getAttribute('href') ? el.getAttribute('href').substr(1) : el.parentNode.getAttribute('id'));
            _this2.targets[i].setAttribute('role', 'tabpanel');
            _this2.targets[i].setAttribute('aria-hidden', true);
            _this2.targets[i].setAttribute('tabIndex', '-1');
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

        this.lastFocusedTab = 0;

        this.tabs.forEach(function (el, i) {
            el.addEventListener('keydown', function (e) {
                switch (e.keyCode) {
                    case KEY_CODES.UP:
                        e.preventDefault();
                        change.call(_this4, previousId());
                        break;
                    case KEY_CODES.LEFT:
                        change.call(_this4, previousId());
                        break;
                    case KEY_CODES.DOWN:
                        e.preventDefault();
                        change.call(_this4, nextId());
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
                    case KEY_CODES.TAB:
                        if (!_this4.getFocusableChildren(_this4.targets[i]).length) return;

                        e.preventDefault();
                        e.stopPropagation();
                        _this4.lastFocusedTab = _this4.getLinkIndex(e.target);
                        _this4.setTargetFocus(_this4.lastFocusedTab);
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
    getTabIndex: function getTabIndex(link) {
        for (var i = 0; i < this.tabs.length; i++) {
            if (link === this.tabs[i]) return i;
        }return null;
    },
    getFocusableChildren: function getFocusableChildren(node) {
        var focusableElements = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabIndex]:not([tabIndex="-1"])'];
        return [].slice.call(node.querySelectorAll(focusableElements.join(',')));
    },
    setTargetFocus: function setTargetFocus(tabIndex) {
        this.focusableChildren = this.getFocusableChildren(this.targets[tabIndex]);
        if (!this.focusableChildren.length) return false;

        if (this.focusableChildren.length) {
            window.setTimeout(function () {
                this.focusableChildren[0].focus();
                this.keyEventListener = this.keyListener.bind(this);
                document.addEventListener('keydown', this.keyEventListener);
            }.bind(this), 0);
        }
    },
    keyListener: function keyListener(e) {
        if (e.keyCode !== KEY_CODES.TAB) return;

        var focusedIndex = this.focusableChildren.indexOf(document.activeElement);

        if (focusedIndex < 0) {
            document.removeEventListener('keydown', this.keyEventListener);
            return;
        }

        if (e.shiftKey && focusedIndex === 0) {
            e.preventDefault();
            this.focusableChildren[this.focusableChildren.length - 1].focus();
        } else {
            if (!e.shiftKey && focusedIndex === this.focusableChildren.length - 1) {
                document.removeEventListener('keydown', this.keyEventListener);
                if (this.lastFocusedTab !== this.tabs.length - 1) {
                    e.preventDefault();
                    this.lastFocusedTab = this.lastFocusedTab + 1;
                    this.tabs[this.lastFocusedTab].focus();
                }
            }
        }
    },
    change: function change(type, i) {
        this.tabs[i].classList[type === 'open' ? 'add' : 'remove'](this.settings.currentClass);
        this.titles[i].classList[type === 'open' ? 'add' : 'remove'](this.settings.currentClass);
        this.targets[i].classList[type === 'open' ? 'add' : 'remove'](this.settings.currentClass);
        this.targets[i].setAttribute('aria-hidden', this.targets[i].getAttribute('aria-hidden') === 'true' ? 'false' : 'true');
        this.tabs[i].setAttribute('aria-selected', this.tabs[i].getAttribute('aria-selected') === 'true' ? 'false' : 'true');
        this.tabs[i].setAttribute('aria-expanded', this.tabs[i].getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
        (type === 'open' ? this.targets[i] : this.targets[this.current]).setAttribute('tabIndex', type === 'open' ? '0' : '-1');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ3RDO3NCQUFBLEFBQWEsS0FBYixBQUFrQixBQUNsQjtBQUZELEFBQWdDLENBQUE7O0FBSWhDLElBQUcsc0JBQUgsQUFBeUIsZUFBUSxBQUFPLGlCQUFQLEFBQXdCLG9CQUFvQixZQUFNLEFBQUU7MEJBQUEsQUFBd0IsUUFBUSxVQUFBLEFBQUMsSUFBRDtXQUFBLEFBQVE7QUFBeEMsQUFBZ0Q7QUFBcEcsQ0FBQTs7Ozs7Ozs7O0FDTmpDOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsS0FBRCxBQUFNLE1BQVMsQUFDM0I7S0FBSSxNQUFNLEdBQUEsQUFBRyxNQUFILEFBQVMsS0FBSyxTQUFBLEFBQVMsaUJBQWpDLEFBQVUsQUFBYyxBQUEwQixBQUVsRDs7S0FBRyxDQUFDLElBQUosQUFBUSxRQUFRLE1BQU0sSUFBQSxBQUFJLE1BQVYsQUFBTSxBQUFVLEFBRWhDOztZQUFPLEFBQUksSUFBSSxVQUFBLEFBQUMsSUFBRDtnQkFBUSxBQUFPLE9BQU8sT0FBQSxBQUFPLDRCQUFyQjtlQUFpRCxBQUMxRCxBQUNaO2FBQVUsT0FBQSxBQUFPLE9BQVAsQUFBYyx3QkFBYyxHQUE1QixBQUErQixTQUZwQixBQUFpRCxBQUU1RCxBQUF3QztBQUZvQixBQUN0RSxHQURxQixFQUFSLEFBQVEsQUFHbkI7QUFISixBQUFPLEFBSVAsRUFKTztBQUxSOztrQkFXZSxFQUFFLE0sQUFBRjs7Ozs7Ozs7QUNkZixJQUFNO1dBQVksQUFDQyxBQUNQO1dBRk0sQUFFQyxBQUNQO1NBSE0sQUFHRCxBQUNMO1VBSk0sQUFJQSxBQUNOO1dBTE0sQUFLQyxBQUNQO1FBTk0sQUFNSCxBQUNIO1VBUFosQUFBa0IsQUFPQTtBQVBBLEFBQ047SUFRSixpQkFBaUIsQ0FBQyxPQUFBLEFBQU8sZUFBUCxBQUFzQixnQkFBZ0Isa0JBQUEsQUFBa0IsU0FBbEIsQUFBMkIsZUFBbEUsQUFBaUYsU0FUMUcsQUFTeUIsQUFBMEY7OztBQUVwRywwQkFDSjtvQkFDSDs7WUFBSSxPQUFPLFNBQUEsQUFBUyxLQUFULEFBQWMsTUFBZCxBQUFvQixNQUEvQixBQUFxQyxBQUVyQzs7YUFBQSxBQUFLLE9BQU8sR0FBQSxBQUFHLE1BQUgsQUFBUyxLQUFLLEtBQUEsQUFBSyxXQUFMLEFBQWdCLGlCQUFpQixLQUFBLEFBQUssU0FBaEUsQUFBWSxBQUFjLEFBQStDLEFBQ3pFO2FBQUEsQUFBSyxTQUFTLEdBQUEsQUFBRyxNQUFILEFBQVMsS0FBSyxLQUFBLEFBQUssV0FBTCxBQUFnQixpQkFBaUIsS0FBQSxBQUFLLFNBQWxFLEFBQWMsQUFBYyxBQUErQyxBQUMzRTthQUFBLEFBQUssZUFBVSxBQUFLLEtBQUwsQUFBVSxJQUFJLGNBQUE7bUJBQU0sU0FBQSxBQUFTLGVBQWUsR0FBQSxBQUFHLGFBQUgsQUFBZ0IsUUFBaEIsQUFBd0IsT0FBaEQsQUFBd0IsQUFBK0IsT0FBTyxRQUFBLEFBQVEsTUFBNUUsQUFBb0UsQUFBYztBQUEvRyxBQUFlLEFBQ2YsU0FEZTthQUNmLEFBQUssVUFBVSxLQUFBLEFBQUssU0FBcEIsQUFBNkIsQUFFN0I7O1lBQUcsU0FBSCxBQUFZLFlBQU8sQUFBSyxRQUFMLEFBQWEsUUFBUSxVQUFBLEFBQUMsUUFBRCxBQUFTLEdBQU0sQUFBRTtnQkFBSSxPQUFBLEFBQU8sYUFBUCxBQUFvQixVQUF4QixBQUFrQyxNQUFNLE1BQUEsQUFBSyxVQUFMLEFBQWUsQUFBSTtBQUFqRyxBQUVuQixTQUZtQjs7YUFFbkIsQUFBSyxBQUNMO2FBQUEsQUFBSyxBQUNMO2FBQUEsQUFBSyxBQUNMO2FBQUEsQUFBSyxLQUFLLEtBQVYsQUFBZSxBQUVmOztlQUFBLEFBQU8sQUFDVjtBQWpCVSxBQWtCWDtBQWxCVyxrQ0FrQkE7cUJBQ1A7O2FBQUEsQUFBSyxLQUFMLEFBQVUsUUFBUSxVQUFBLEFBQUMsSUFBRCxBQUFLLEdBQU0sQUFDekI7ZUFBQSxBQUFHLGFBQUgsQUFBZ0IsUUFBaEIsQUFBd0IsQUFDeEI7ZUFBQSxBQUFHLGFBQUgsQUFBZ0IsWUFBaEIsQUFBNEIsQUFDNUI7ZUFBQSxBQUFHLGFBQUgsQUFBZ0IsaUJBQWhCLEFBQWlDLEFBQ2pDO2VBQUEsQUFBRyxhQUFILEFBQWdCLGlCQUFoQixBQUFpQyxBQUNqQztlQUFBLEFBQUcsYUFBSCxBQUFnQixpQkFBaUIsR0FBQSxBQUFHLGFBQUgsQUFBZ0IsVUFBVSxHQUFBLEFBQUcsYUFBSCxBQUFnQixRQUFoQixBQUF3QixPQUFsRCxBQUEwQixBQUErQixLQUFLLEdBQUEsQUFBRyxXQUFILEFBQWMsYUFBN0csQUFBK0YsQUFBMkIsQUFDMUg7bUJBQUEsQUFBSyxRQUFMLEFBQWEsR0FBYixBQUFnQixhQUFoQixBQUE2QixRQUE3QixBQUFxQyxBQUNyQzttQkFBQSxBQUFLLFFBQUwsQUFBYSxHQUFiLEFBQWdCLGFBQWhCLEFBQTZCLGVBQTdCLEFBQTRDLEFBQzVDO21CQUFBLEFBQUssUUFBTCxBQUFhLEdBQWIsQUFBZ0IsYUFBaEIsQUFBNkIsWUFBN0IsQUFBeUMsQUFDNUM7QUFURCxBQVVBO2VBQUEsQUFBTyxBQUNWO0FBOUJVLEFBK0JYO0FBL0JXLHNDQStCRTtxQkFDVDs7WUFBSSxVQUFVLFNBQVYsQUFBVSxXQUFLLEFBQUU7bUJBQUEsQUFBSyxPQUFMLEFBQVksQUFBSztBQUF0QyxBQUVBOzthQUFBLEFBQUssT0FBTCxBQUFZLFFBQVEsVUFBQSxBQUFDLElBQUQsQUFBSyxHQUFNLEFBQzNCOzJCQUFBLEFBQWUsUUFBUSxjQUFNLEFBQ3pCO21CQUFBLEFBQUcsaUJBQUgsQUFBb0IsSUFBSSxhQUFLLEFBQ3pCO3dCQUFHLEVBQUEsQUFBRSxXQUFXLEVBQUEsQUFBRSxZQUFZLFVBQTlCLEFBQXdDLEtBQUssQUFFN0M7O3dCQUFHLENBQUMsRUFBRCxBQUFHLFdBQVcsRUFBQSxBQUFFLFlBQVksVUFBNUIsQUFBc0MsU0FBUyxFQUFBLEFBQUUsWUFBWSxVQUFoRSxBQUEwRSxPQUFNLEFBQzVFOzBCQUFBLEFBQUUsQUFDRjtnQ0FBQSxBQUFRLGFBQVIsQUFBbUIsQUFDdEI7QUFDSjtBQVBELG1CQUFBLEFBT0csQUFDTjtBQVRELEFBVUg7QUFYRCxBQWFBOztlQUFBLEFBQU8sQUFDVjtBQWhEVSxBQWlEWDtBQWpEVyxrQ0FpREE7cUJBQ1A7O1lBQUksU0FBUyxTQUFULEFBQVMsV0FBTSxBQUNYO21CQUFBLEFBQUssT0FBTCxBQUFZLEFBQ1o7bUJBQUEsQUFBTyxXQUFXLFlBQU0sQUFBRTt1QkFBQSxBQUFLLEtBQUssT0FBVixBQUFlLFNBQWYsQUFBd0IsQUFBVTtBQUE1RCxlQUFBLEFBQThELEFBQ2pFO0FBSEw7WUFJSSxTQUFTLFNBQVQsQUFBUyxTQUFBO21CQUFPLE9BQUEsQUFBSyxZQUFZLE9BQUEsQUFBSyxLQUFMLEFBQVUsU0FBM0IsQUFBb0MsSUFBcEMsQUFBd0MsSUFBSSxPQUFBLEFBQUssVUFBeEQsQUFBa0U7QUFKL0U7WUFLSSxhQUFhLFNBQWIsQUFBYSxhQUFBO21CQUFPLE9BQUEsQUFBSyxZQUFMLEFBQWlCLElBQUksT0FBQSxBQUFLLEtBQUwsQUFBVSxTQUEvQixBQUF3QyxJQUFJLE9BQUEsQUFBSyxVQUF4RCxBQUFrRTtBQUxuRixBQU9BOzthQUFBLEFBQUssaUJBQUwsQUFBc0IsQUFFdEI7O2FBQUEsQUFBSyxLQUFMLEFBQVUsUUFBUSxVQUFBLEFBQUMsSUFBRCxBQUFLLEdBQU0sQUFDekI7ZUFBQSxBQUFHLGlCQUFILEFBQW9CLFdBQVcsYUFBSyxBQUNoQzt3QkFBUSxFQUFSLEFBQVUsQUFDVjt5QkFBSyxVQUFMLEFBQWUsQUFDWDswQkFBQSxBQUFFLEFBQ0Y7K0JBQUEsQUFBTyxhQUFQLEFBQWtCLEFBQ2xCO0FBQ0o7eUJBQUssVUFBTCxBQUFlLEFBQ1g7K0JBQUEsQUFBTyxhQUFQLEFBQWtCLEFBQ2xCO0FBQ0o7eUJBQUssVUFBTCxBQUFlLEFBQ1g7MEJBQUEsQUFBRSxBQUNGOytCQUFBLEFBQU8sYUFBUCxBQUFrQixBQUNsQjtBQUNKO3lCQUFLLFVBQUwsQUFBZSxBQUNYOytCQUFBLEFBQU8sYUFBUCxBQUFrQixBQUNsQjtBQUNKO3lCQUFLLFVBQUwsQUFBZSxBQUNYOytCQUFBLEFBQU8sYUFBUCxBQUFrQixBQUNsQjtBQUNKO3lCQUFLLFVBQUwsQUFBZSxBQUNYOzBCQUFBLEFBQUUsQUFDRjsrQkFBQSxBQUFPLGFBQVAsQUFBa0IsQUFDbEI7QUFDSjt5QkFBSyxVQUFMLEFBQWUsQUFDWDs0QkFBRyxDQUFDLE9BQUEsQUFBSyxxQkFBcUIsT0FBQSxBQUFLLFFBQS9CLEFBQTBCLEFBQWEsSUFBM0MsQUFBK0MsUUFBUSxBQUV2RDs7MEJBQUEsQUFBRSxBQUNGOzBCQUFBLEFBQUUsQUFDRjsrQkFBQSxBQUFLLGlCQUFpQixPQUFBLEFBQUssYUFBYSxFQUF4QyxBQUFzQixBQUFvQixBQUMxQzsrQkFBQSxBQUFLLGVBQWUsT0FBcEIsQUFBeUIsQUFDekI7K0JBQUEsQUFBTyxhQUFQLEFBQWtCLEFBQ2xCO0FBQ0o7QUFDSTtBQWhDSixBQWtDSDs7QUFuQ0QsQUFxQ0E7O2VBQUEsQUFBRyxpQkFBSCxBQUFvQixTQUFTLGFBQUssQUFDOUI7a0JBQUEsQUFBRSxBQUNGO2tCQUFBLEFBQUUsQUFDRjt1QkFBQSxBQUFPLGFBQVAsQUFBa0IsQUFDckI7QUFKRCxlQUFBLEFBSUcsQUFDTjtBQTNDRCxBQTZDQTs7ZUFBQSxBQUFPLEFBQ1Y7QUF6R1UsQUEwR1g7QUExR1csc0NBQUEsQUEwR0MsTUFBSyxBQUNiO2FBQUksSUFBSSxJQUFSLEFBQVksR0FBRyxJQUFJLEtBQUEsQUFBSyxLQUF4QixBQUE2QixRQUE3QixBQUFxQyxLQUFLO2dCQUFHLFNBQVMsS0FBQSxBQUFLLEtBQWpCLEFBQVksQUFBVSxJQUFJLE9BQXBFLEFBQW9FLEFBQU87QUFDM0UsZ0JBQUEsQUFBTyxBQUNWO0FBN0dVLEFBOEdYO0FBOUdXLHdEQUFBLEFBOEdVLE1BQU0sQUFDdkI7WUFBSSxvQkFBb0IsQ0FBQSxBQUFDLFdBQUQsQUFBWSxjQUFaLEFBQTBCLHlCQUExQixBQUFtRCwwQkFBbkQsQUFBNkUsNEJBQTdFLEFBQXlHLDBCQUF6RyxBQUFtSSxVQUFuSSxBQUE2SSxVQUE3SSxBQUF1SixTQUF2SixBQUFnSyxxQkFBeEwsQUFBd0IsQUFBcUwsQUFDN007ZUFBTyxHQUFBLEFBQUcsTUFBSCxBQUFTLEtBQUssS0FBQSxBQUFLLGlCQUFpQixrQkFBQSxBQUFrQixLQUE3RCxBQUFPLEFBQWMsQUFBc0IsQUFBdUIsQUFDckU7QUFqSFUsQUFrSFg7QUFsSFcsNENBQUEsQUFrSEksVUFBUyxBQUNwQjthQUFBLEFBQUssb0JBQW9CLEtBQUEsQUFBSyxxQkFBcUIsS0FBQSxBQUFLLFFBQXhELEFBQXlCLEFBQTBCLEFBQWEsQUFDaEU7WUFBRyxDQUFDLEtBQUEsQUFBSyxrQkFBVCxBQUEyQixRQUFRLE9BQUEsQUFBTyxBQUUxQzs7WUFBRyxLQUFBLEFBQUssa0JBQVIsQUFBMEIsUUFBTyxBQUM3QjttQkFBQSxBQUFPLHVCQUFxQixBQUN4QjtxQkFBQSxBQUFLLGtCQUFMLEFBQXVCLEdBQXZCLEFBQTBCLEFBQzFCO3FCQUFBLEFBQUssbUJBQW1CLEtBQUEsQUFBSyxZQUFMLEFBQWlCLEtBQXpDLEFBQXdCLEFBQXNCLEFBQzlDO3lCQUFBLEFBQVMsaUJBQVQsQUFBMEIsV0FBVyxLQUFyQyxBQUEwQyxBQUM3QztBQUppQixhQUFBLENBQUEsQUFJaEIsS0FKRixBQUFrQixBQUlYLE9BSlAsQUFJYyxBQUNqQjtBQUNKO0FBN0hVLEFBOEhYO0FBOUhXLHNDQUFBLEFBOEhDLEdBQUUsQUFDVjtZQUFJLEVBQUEsQUFBRSxZQUFZLFVBQWxCLEFBQTRCLEtBQUssQUFFakM7O1lBQUksZUFBZSxLQUFBLEFBQUssa0JBQUwsQUFBdUIsUUFBUSxTQUFsRCxBQUFtQixBQUF3QyxBQUUzRDs7WUFBRyxlQUFILEFBQWtCLEdBQUcsQUFDakI7cUJBQUEsQUFBUyxvQkFBVCxBQUE2QixXQUFXLEtBQXhDLEFBQTZDLEFBQzdDO0FBQ0g7QUFFRDs7WUFBRyxFQUFBLEFBQUUsWUFBWSxpQkFBakIsQUFBa0MsR0FBRyxBQUNqQztjQUFBLEFBQUUsQUFDRjtpQkFBQSxBQUFLLGtCQUFrQixLQUFBLEFBQUssa0JBQUwsQUFBdUIsU0FBOUMsQUFBdUQsR0FBdkQsQUFBMEQsQUFDN0Q7QUFIRCxlQUdPLEFBQ0g7Z0JBQUcsQ0FBQyxFQUFELEFBQUcsWUFBWSxpQkFBaUIsS0FBQSxBQUFLLGtCQUFMLEFBQXVCLFNBQTFELEFBQW1FLEdBQUcsQUFDbEU7eUJBQUEsQUFBUyxvQkFBVCxBQUE2QixXQUFXLEtBQXhDLEFBQTZDLEFBQzdDO29CQUFHLEtBQUEsQUFBSyxtQkFBbUIsS0FBQSxBQUFLLEtBQUwsQUFBVSxTQUFyQyxBQUE4QyxHQUFHLEFBQzdDO3NCQUFBLEFBQUUsQUFDRjt5QkFBQSxBQUFLLGlCQUFpQixLQUFBLEFBQUssaUJBQTNCLEFBQTRDLEFBQzVDO3lCQUFBLEFBQUssS0FBSyxLQUFWLEFBQWUsZ0JBQWYsQUFBK0IsQUFDbEM7QUFFSjtBQUNKO0FBQ0o7QUF0SlUsQUF1Slg7QUF2SlcsNEJBQUEsQUF1SkosTUF2SkksQUF1SkUsR0FBRyxBQUNaO2FBQUEsQUFBSyxLQUFMLEFBQVUsR0FBVixBQUFhLFVBQVcsU0FBQSxBQUFTLFNBQVQsQUFBa0IsUUFBMUMsQUFBa0QsVUFBVyxLQUFBLEFBQUssU0FBbEUsQUFBMkUsQUFDM0U7YUFBQSxBQUFLLE9BQUwsQUFBWSxHQUFaLEFBQWUsVUFBVyxTQUFBLEFBQVMsU0FBVCxBQUFrQixRQUE1QyxBQUFvRCxVQUFXLEtBQUEsQUFBSyxTQUFwRSxBQUE2RSxBQUM3RTthQUFBLEFBQUssUUFBTCxBQUFhLEdBQWIsQUFBZ0IsVUFBVyxTQUFBLEFBQVMsU0FBVCxBQUFrQixRQUE3QyxBQUFxRCxVQUFXLEtBQUEsQUFBSyxTQUFyRSxBQUE4RSxBQUM5RTthQUFBLEFBQUssUUFBTCxBQUFhLEdBQWIsQUFBZ0IsYUFBaEIsQUFBNkIsZUFBZSxLQUFBLEFBQUssUUFBTCxBQUFhLEdBQWIsQUFBZ0IsYUFBaEIsQUFBNkIsbUJBQTdCLEFBQWdELFNBQWhELEFBQXlELFVBQXJHLEFBQStHLEFBQy9HO2FBQUEsQUFBSyxLQUFMLEFBQVUsR0FBVixBQUFhLGFBQWIsQUFBMEIsaUJBQWlCLEtBQUEsQUFBSyxLQUFMLEFBQVUsR0FBVixBQUFhLGFBQWIsQUFBMEIscUJBQTFCLEFBQStDLFNBQS9DLEFBQXdELFVBQW5HLEFBQTZHLEFBQzdHO2FBQUEsQUFBSyxLQUFMLEFBQVUsR0FBVixBQUFhLGFBQWIsQUFBMEIsaUJBQWlCLEtBQUEsQUFBSyxLQUFMLEFBQVUsR0FBVixBQUFhLGFBQWIsQUFBMEIscUJBQTFCLEFBQStDLFNBQS9DLEFBQXdELFVBQW5HLEFBQTZHLEFBQzdHO1NBQUMsU0FBQSxBQUFTLFNBQVMsS0FBQSxBQUFLLFFBQXZCLEFBQWtCLEFBQWEsS0FBSyxLQUFBLEFBQUssUUFBUSxLQUFsRCxBQUFxQyxBQUFrQixVQUF2RCxBQUFpRSxhQUFqRSxBQUE4RSxZQUFhLFNBQUEsQUFBUyxTQUFULEFBQWtCLE1BQTdHLEFBQW1ILEFBQ3RIO0FBL0pVLEFBZ0tYO0FBaEtXLHdCQUFBLEFBZ0tOLEdBQUcsQUFDSjthQUFBLEFBQUssT0FBTCxBQUFZLFFBQVosQUFBb0IsQUFDcEI7YUFBQSxBQUFLLFVBQUwsQUFBZSxBQUNmO2VBQUEsQUFBTyxBQUNWO0FBcEtVLEFBcUtYO0FBcktXLDBCQUFBLEFBcUtMLEdBQUcsQUFDTDthQUFBLEFBQUssT0FBTCxBQUFZLFNBQVosQUFBcUIsQUFDckI7ZUFBQSxBQUFPLEFBQ1Y7QUF4S1UsQUF5S1g7QUF6S1csNEJBQUEsQUF5S0osR0FBRyxBQUNOO1lBQUcsS0FBQSxBQUFLLFlBQVIsQUFBb0IsR0FBRyxBQUFFO0FBQVM7QUFFbEM7O1NBQUMsQ0FBQyxPQUFBLEFBQU8sUUFBVCxBQUFpQixhQUFhLE9BQUEsQUFBTyxRQUFQLEFBQWUsVUFBVSxFQUFFLEtBQUssS0FBQSxBQUFLLEtBQUwsQUFBVSxHQUFWLEFBQWEsYUFBN0MsQUFBeUIsQUFBTyxBQUEwQixXQUExRCxBQUFxRSxJQUFJLEtBQUEsQUFBSyxLQUFMLEFBQVUsR0FBVixBQUFhLGFBQXBILEFBQThCLEFBQXlFLEFBQTBCLEFBRWpJOztZQUFHLEtBQUEsQUFBSyxZQUFSLEFBQW9CLE1BQU0sS0FBQSxBQUFLLEtBQS9CLEFBQTBCLEFBQVUsUUFDL0IsS0FBQSxBQUFLLE1BQU0sS0FBWCxBQUFnQixTQUFoQixBQUF5QixLQUF6QixBQUE4QixBQUVuQzs7ZUFBQSxBQUFPLEFBQ1Y7QSxBQWxMVTtBQUFBLEFBQ1g7Ozs7Ozs7OztjQ1pXLEFBQ0QsQUFDVjtnQkFGVyxBQUVDLEFBQ1o7a0JBSFcsQUFHRyxBQUNkO1ksQUFKVyxBQUlIO0FBSkcsQUFDWCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgVGFiQWNjb3JkaW9uIGZyb20gJy4vbGlicy9jb21wb25lbnQnO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG5cdFRhYkFjY29yZGlvbi5pbml0KCcuanMtdGFiLWFjY29yZGlvbicpO1xufV07XG4gICAgXG5pZignYWRkRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93KSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHsgb25ET01Db250ZW50TG9hZGVkVGFza3MuZm9yRWFjaCgoZm4pID0+IGZuKCkpOyB9KTsiLCJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9saWIvZGVmYXVsdHMnO1xuaW1wb3J0IGNvbXBvbmVudFByb3RvdHlwZSBmcm9tICcuL2xpYi9jb21wb25lbnQtcHJvdG90eXBlJztcblxuY29uc3QgaW5pdCA9IChzZWwsIG9wdHMpID0+IHtcblx0bGV0IGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpKTtcblx0XG5cdGlmKCFlbHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ1RhYiBBY2NvcmRpb24gY2Fubm90IGJlIGluaXRpYWxpc2VkLCBubyBhdWdtZW50YWJsZSBlbGVtZW50cyBmb3VuZCcpO1xuXG5cdHJldHVybiBlbHMubWFwKChlbCkgPT4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGNvbXBvbmVudFByb3RvdHlwZSksIHtcblx0XHRcdERPTUVsZW1lbnQ6IGVsLFxuXHRcdFx0c2V0dGluZ3M6IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBlbC5kYXRhc2V0LCBvcHRzKVxuXHRcdH0pLmluaXQoKSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7IGluaXQgfTsiLCJjb25zdCBLRVlfQ09ERVMgPSB7XG4gICAgICAgICAgICBTUEFDRTogMzIsXG4gICAgICAgICAgICBFTlRFUjogMTMsXG4gICAgICAgICAgICBUQUI6IDksXG4gICAgICAgICAgICBMRUZUOiAzNyxcbiAgICAgICAgICAgIFJJR0hUOiAzOSxcbiAgICAgICAgICAgIFVQOjM4LFxuICAgICAgICAgICAgRE9XTjogNDBcbiAgICAgICAgfSxcbiAgICAgICAgVFJJR0dFUl9FVkVOVFMgPSBbd2luZG93LlBvaW50ZXJFdmVudCA/ICdwb2ludGVyZG93bicgOiAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgPyAndG91Y2hzdGFydCcgOiAnY2xpY2snLCAna2V5ZG93bicgXTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGluaXQoKSB7XG4gICAgICAgIGxldCBoYXNoID0gbG9jYXRpb24uaGFzaC5zbGljZSgxKSB8fCBmYWxzZTtcblxuICAgICAgICB0aGlzLnRhYnMgPSBbXS5zbGljZS5jYWxsKHRoaXMuRE9NRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuc2V0dGluZ3MudGFiQ2xhc3MpKTtcbiAgICAgICAgdGhpcy50aXRsZXMgPSBbXS5zbGljZS5jYWxsKHRoaXMuRE9NRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuc2V0dGluZ3MudGl0bGVDbGFzcykpO1xuICAgICAgICB0aGlzLnRhcmdldHMgPSB0aGlzLnRhYnMubWFwKGVsID0+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsLmdldEF0dHJpYnV0ZSgnaHJlZicpLnN1YnN0cigxKSkgfHwgY29uc29sZS5lcnJvcignVGFiIHRhcmdldCBub3QgZm91bmQnKSk7XG4gICAgICAgIHRoaXMuY3VycmVudCA9IHRoaXMuc2V0dGluZ3MuYWN0aXZlO1xuXG4gICAgICAgIGlmKGhhc2ggIT09IGZhbHNlKSB0aGlzLnRhcmdldHMuZm9yRWFjaCgodGFyZ2V0LCBpKSA9PiB7IGlmICh0YXJnZXQuZ2V0QXR0cmlidXRlKCdpZCcpID09PSBoYXNoKSB0aGlzLmN1cnJlbnQgPSBpOyB9KTtcblxuICAgICAgICB0aGlzLmluaXRBcmlhKCk7XG4gICAgICAgIHRoaXMuaW5pdFRpdGxlcygpO1xuICAgICAgICB0aGlzLmluaXRUYWJzKCk7XG4gICAgICAgIHRoaXMub3Blbih0aGlzLmN1cnJlbnQpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaW5pdEFyaWEoKSB7XG4gICAgICAgIHRoaXMudGFicy5mb3JFYWNoKChlbCwgaSkgPT4ge1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYicpO1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCd0YWJJbmRleCcsIDApO1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJywgZWwuZ2V0QXR0cmlidXRlKCdocmVmJykgPyBlbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5zdWJzdHIoMSkgOiBlbC5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZSgnaWQnKSk7XG4gICAgICAgICAgICB0aGlzLnRhcmdldHNbaV0uc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYnBhbmVsJyk7XG4gICAgICAgICAgICB0aGlzLnRhcmdldHNbaV0uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy50YXJnZXRzW2ldLnNldEF0dHJpYnV0ZSgndGFiSW5kZXgnLCAnLTEnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaW5pdFRpdGxlcygpIHtcbiAgICAgICAgbGV0IGhhbmRsZXIgPSBpID0+IHsgdGhpcy50b2dnbGUoaSk7IH07XG5cbiAgICAgICAgdGhpcy50aXRsZXMuZm9yRWFjaCgoZWwsIGkpID0+IHtcbiAgICAgICAgICAgIFRSSUdHRVJfRVZFTlRTLmZvckVhY2goZXYgPT4ge1xuICAgICAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXYsIGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZihlLmtleUNvZGUgJiYgZS5rZXlDb2RlID09PSBLRVlfQ09ERVMuVEFCKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoIWUua2V5Q29kZSB8fCBlLmtleUNvZGUgPT09IEtFWV9DT0RFUy5FTlRFUiB8fCBlLmtleUNvZGUgPT09IEtFWV9DT0RFUy5TUEFDRSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgaSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBpbml0VGFicygpIHtcbiAgICAgICAgbGV0IGNoYW5nZSA9IGlkID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZShpZCk7XG4gICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnRhYnNbdGhpcy5jdXJyZW50XS5mb2N1cygpOyB9LCAxNik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmV4dElkID0gKCkgPT4gKHRoaXMuY3VycmVudCA9PT0gdGhpcy50YWJzLmxlbmd0aCAtIDEgPyAwIDogdGhpcy5jdXJyZW50ICsgMSksXG4gICAgICAgICAgICBwcmV2aW91c0lkID0gKCkgPT4gKHRoaXMuY3VycmVudCA9PT0gMCA/IHRoaXMudGFicy5sZW5ndGggLSAxIDogdGhpcy5jdXJyZW50IC0gMSk7XG5cbiAgICAgICAgdGhpcy5sYXN0Rm9jdXNlZFRhYiA9IDA7XG5cbiAgICAgICAgdGhpcy50YWJzLmZvckVhY2goKGVsLCBpKSA9PiB7XG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZSA9PiB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5VUDpcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBwcmV2aW91c0lkKCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5MRUZUOlxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBwcmV2aW91c0lkKCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5ET1dOOlxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZS5jYWxsKHRoaXMsIG5leHRJZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuUklHSFQ6XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZS5jYWxsKHRoaXMsIG5leHRJZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuRU5URVI6XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZS5jYWxsKHRoaXMsIGkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5TUEFDRTpcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuVEFCOlxuICAgICAgICAgICAgICAgICAgICBpZighdGhpcy5nZXRGb2N1c2FibGVDaGlsZHJlbih0aGlzLnRhcmdldHNbaV0pLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0Rm9jdXNlZFRhYiA9IHRoaXMuZ2V0TGlua0luZGV4KGUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRUYXJnZXRGb2N1cyh0aGlzLmxhc3RGb2N1c2VkVGFiKTtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgaSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGNoYW5nZS5jYWxsKHRoaXMsIGkpO1xuICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGdldFRhYkluZGV4KGxpbmspe1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy50YWJzLmxlbmd0aDsgaSsrKSBpZihsaW5rID09PSB0aGlzLnRhYnNbaV0pIHJldHVybiBpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIGdldEZvY3VzYWJsZUNoaWxkcmVuKG5vZGUpIHtcbiAgICAgICAgbGV0IGZvY3VzYWJsZUVsZW1lbnRzID0gWydhW2hyZWZdJywgJ2FyZWFbaHJlZl0nLCAnaW5wdXQ6bm90KFtkaXNhYmxlZF0pJywgJ3NlbGVjdDpub3QoW2Rpc2FibGVkXSknLCAndGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pJywgJ2J1dHRvbjpub3QoW2Rpc2FibGVkXSknLCAnaWZyYW1lJywgJ29iamVjdCcsICdlbWJlZCcsICdbY29udGVudGVkaXRhYmxlXScsICdbdGFiSW5kZXhdOm5vdChbdGFiSW5kZXg9XCItMVwiXSknXTtcbiAgICAgICAgcmV0dXJuIFtdLnNsaWNlLmNhbGwobm9kZS5xdWVyeVNlbGVjdG9yQWxsKGZvY3VzYWJsZUVsZW1lbnRzLmpvaW4oJywnKSkpO1xuICAgIH0sXG4gICAgc2V0VGFyZ2V0Rm9jdXModGFiSW5kZXgpe1xuICAgICAgICB0aGlzLmZvY3VzYWJsZUNoaWxkcmVuID0gdGhpcy5nZXRGb2N1c2FibGVDaGlsZHJlbih0aGlzLnRhcmdldHNbdGFiSW5kZXhdKTtcbiAgICAgICAgaWYoIXRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCl7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW5bMF0uZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmtleUV2ZW50TGlzdGVuZXIgPSB0aGlzLmtleUxpc3RlbmVyLmJpbmQodGhpcyk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMua2V5RXZlbnRMaXN0ZW5lcik7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksIDApO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBrZXlMaXN0ZW5lcihlKXtcbiAgICAgICAgaWYgKGUua2V5Q29kZSAhPT0gS0VZX0NPREVTLlRBQikgcmV0dXJuO1xuICAgICAgICBcbiAgICAgICAgbGV0IGZvY3VzZWRJbmRleCA9IHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4uaW5kZXhPZihkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcbiAgICAgICAgXG4gICAgICAgIGlmKGZvY3VzZWRJbmRleCA8IDApIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleUV2ZW50TGlzdGVuZXIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZihlLnNoaWZ0S2V5ICYmIGZvY3VzZWRJbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5mb2N1c2FibGVDaGlsZHJlblt0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAtIDFdLmZvY3VzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZighZS5zaGlmdEtleSAmJiBmb2N1c2VkSW5kZXggPT09IHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleUV2ZW50TGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMubGFzdEZvY3VzZWRUYWIgIT09IHRoaXMudGFicy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0Rm9jdXNlZFRhYiA9IHRoaXMubGFzdEZvY3VzZWRUYWIgKyAxO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRhYnNbdGhpcy5sYXN0Rm9jdXNlZFRhYl0uZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNoYW5nZSh0eXBlLCBpKSB7XG4gICAgICAgIHRoaXMudGFic1tpXS5jbGFzc0xpc3RbKHR5cGUgPT09ICdvcGVuJyA/ICdhZGQnIDogJ3JlbW92ZScpXSh0aGlzLnNldHRpbmdzLmN1cnJlbnRDbGFzcyk7XG4gICAgICAgIHRoaXMudGl0bGVzW2ldLmNsYXNzTGlzdFsodHlwZSA9PT0gJ29wZW4nID8gJ2FkZCcgOiAncmVtb3ZlJyldKHRoaXMuc2V0dGluZ3MuY3VycmVudENsYXNzKTtcbiAgICAgICAgdGhpcy50YXJnZXRzW2ldLmNsYXNzTGlzdFsodHlwZSA9PT0gJ29wZW4nID8gJ2FkZCcgOiAncmVtb3ZlJyldKHRoaXMuc2V0dGluZ3MuY3VycmVudENsYXNzKTtcbiAgICAgICAgdGhpcy50YXJnZXRzW2ldLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0aGlzLnRhcmdldHNbaV0uZ2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicpID09PSAndHJ1ZScgPyAnZmFsc2UnIDogJ3RydWUnICk7XG4gICAgICAgIHRoaXMudGFic1tpXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCB0aGlzLnRhYnNbaV0uZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJyA/ICdmYWxzZScgOiAndHJ1ZScgKTtcbiAgICAgICAgdGhpcy50YWJzW2ldLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIHRoaXMudGFic1tpXS5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ3RydWUnID8gJ2ZhbHNlJyA6ICd0cnVlJyApO1xuICAgICAgICAodHlwZSA9PT0gJ29wZW4nID8gdGhpcy50YXJnZXRzW2ldIDogdGhpcy50YXJnZXRzW3RoaXMuY3VycmVudF0pLnNldEF0dHJpYnV0ZSgndGFiSW5kZXgnLCAodHlwZSA9PT0gJ29wZW4nID8gJzAnIDogJy0xJykpO1xuICAgIH0sXG4gICAgb3BlbihpKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlKCdvcGVuJywgaSk7XG4gICAgICAgIHRoaXMuY3VycmVudCA9IGk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgY2xvc2UoaSkge1xuICAgICAgICB0aGlzLmNoYW5nZSgnY2xvc2UnLCBpKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICB0b2dnbGUoaSkge1xuICAgICAgICBpZih0aGlzLmN1cnJlbnQgPT09IGkpIHsgcmV0dXJuOyB9XG4gICAgICAgIFxuICAgICAgICAhIXdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSAmJiB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoeyBVUkw6IHRoaXMudGFic1tpXS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSB9LCAnJywgdGhpcy50YWJzW2ldLmdldEF0dHJpYnV0ZSgnaHJlZicpKTtcblxuICAgICAgICBpZih0aGlzLmN1cnJlbnQgPT09IG51bGwpIHRoaXMub3BlbihpKTtcbiAgICAgICAgZWxzZSB0aGlzLmNsb3NlKHRoaXMuY3VycmVudCkub3BlbihpKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59OyIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICB0YWJDbGFzczogJy5qcy10YWItYWNjb3JkaW9uLXRhYicsXG4gICAgdGl0bGVDbGFzczogJy5qcy10YWItYWNjb3JkaW9uLXRpdGxlJyxcbiAgICBjdXJyZW50Q2xhc3M6ICdhY3RpdmUnLFxuICAgIGFjdGl2ZTogMFxufTsiXX0=
