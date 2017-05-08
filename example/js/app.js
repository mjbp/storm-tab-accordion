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
			settings: Object.assign({}, _defaults2.default, opts)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ3RDO3NCQUFBLEFBQWEsS0FBYixBQUFrQixBQUNsQjtBQUZELEFBQWdDLENBQUE7O0FBSWhDLElBQUcsc0JBQUgsQUFBeUIsZUFBUSxBQUFPLGlCQUFQLEFBQXdCLG9CQUFvQixZQUFNLEFBQUU7MEJBQUEsQUFBd0IsUUFBUSxVQUFBLEFBQUMsSUFBRDtXQUFBLEFBQVE7QUFBeEMsQUFBZ0Q7QUFBcEcsQ0FBQTs7Ozs7Ozs7O0FDTmpDOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsS0FBRCxBQUFNLE1BQVMsQUFDM0I7S0FBSSxNQUFNLEdBQUEsQUFBRyxNQUFILEFBQVMsS0FBSyxTQUFBLEFBQVMsaUJBQWpDLEFBQVUsQUFBYyxBQUEwQixBQUVsRDs7S0FBRyxDQUFDLElBQUosQUFBUSxRQUFRLE1BQU0sSUFBQSxBQUFJLE1BQVYsQUFBTSxBQUFVLEFBRWhDOztZQUFPLEFBQUksSUFBSSxVQUFBLEFBQUMsSUFBTyxBQUN0QjtnQkFBTyxBQUFPLE9BQU8sT0FBQSxBQUFPLDRCQUFyQjtlQUFpRCxBQUMzQyxBQUNaO2FBQVUsT0FBQSxBQUFPLE9BQVAsQUFBYyx3QkFGbEIsQUFBaUQsQUFFN0MsQUFBNEI7QUFGaUIsQUFDdkQsR0FETSxFQUFQLEFBQU8sQUFHSixBQUNIO0FBTEQsQUFBTyxBQU1QLEVBTk87QUFMUjs7a0JBYWUsRUFBRSxN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QUFULEFBQWlCLGFBQWEsT0FBQSxBQUFPLFFBQVAsQUFBZSxVQUFVLEVBQUUsS0FBSyxLQUFBLEFBQUssS0FBTCxBQUFVLEdBQVYsQUFBYSxhQUE3QyxBQUF5QixBQUFPLEFBQTBCLFdBQTFELEFBQXFFLElBQUksS0FBQSxBQUFLLEtBQUwsQUFBVSxHQUFWLEFBQWEsYUFBcEgsQUFBOEIsQUFBeUUsQUFBMEIsQUFFakk7O1lBQUcsS0FBQSxBQUFLLFlBQVIsQUFBb0IsTUFBTSxLQUFBLEFBQUssS0FBL0IsQUFBMEIsQUFBVSxRQUMvQixLQUFBLEFBQUssTUFBTSxLQUFYLEFBQWdCLFNBQWhCLEFBQXlCLEtBQXpCLEFBQThCLEFBRW5DOztlQUFBLEFBQU8sQUFDVjtBLEFBbExVO0FBQUEsQUFDWDs7Ozs7Ozs7O2NDWlcsQUFDRCxBQUNWO2dCQUZXLEFBRUMsQUFDWjtrQkFIVyxBQUdHLEFBQ2Q7WSxBQUpXLEFBSUg7QUFKRyxBQUNYIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBUYWJBY2NvcmRpb24gZnJvbSAnLi9saWJzL2NvbXBvbmVudCc7XG5cbmNvbnN0IG9uRE9NQ29udGVudExvYWRlZFRhc2tzID0gWygpID0+IHtcblx0VGFiQWNjb3JkaW9uLmluaXQoJy5qcy10YWItYWNjb3JkaW9uJyk7XG59XTtcbiAgICBcbmlmKCdhZGRFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cpIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4geyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKChmbikgPT4gZm4oKSk7IH0pOyIsImltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2xpYi9kZWZhdWx0cyc7XG5pbXBvcnQgY29tcG9uZW50UHJvdG90eXBlIGZyb20gJy4vbGliL2NvbXBvbmVudC1wcm90b3R5cGUnO1xuXG5jb25zdCBpbml0ID0gKHNlbCwgb3B0cykgPT4ge1xuXHRsZXQgZWxzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpO1xuXHRcblx0aWYoIWVscy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignVGFiIEFjY29yZGlvbiBjYW5ub3QgYmUgaW5pdGlhbGlzZWQsIG5vIGF1Z21lbnRhYmxlIGVsZW1lbnRzIGZvdW5kJyk7XG5cblx0cmV0dXJuIGVscy5tYXAoKGVsKSA9PiB7XG5cdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShjb21wb25lbnRQcm90b3R5cGUpLCB7XG5cdFx0XHRET01FbGVtZW50OiBlbCxcblx0XHRcdHNldHRpbmdzOiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0cylcblx0XHR9KS5pbml0KCk7XG5cdH0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgeyBpbml0IH07IiwiY29uc3QgS0VZX0NPREVTID0ge1xuICAgICAgICAgICAgU1BBQ0U6IDMyLFxuICAgICAgICAgICAgRU5URVI6IDEzLFxuICAgICAgICAgICAgVEFCOiA5LFxuICAgICAgICAgICAgTEVGVDogMzcsXG4gICAgICAgICAgICBSSUdIVDogMzksXG4gICAgICAgICAgICBVUDozOCxcbiAgICAgICAgICAgIERPV046IDQwXG4gICAgICAgIH0sXG4gICAgICAgIFRSSUdHRVJfRVZFTlRTID0gW3dpbmRvdy5Qb2ludGVyRXZlbnQgPyAncG9pbnRlcmRvd24nIDogJ29udG91Y2hzdGFydCcgaW4gd2luZG93ID8gJ3RvdWNoc3RhcnQnIDogJ2NsaWNrJywgJ2tleWRvd24nIF07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBpbml0KCkge1xuICAgICAgICBsZXQgaGFzaCA9IGxvY2F0aW9uLmhhc2guc2xpY2UoMSkgfHwgZmFsc2U7XG5cbiAgICAgICAgdGhpcy50YWJzID0gW10uc2xpY2UuY2FsbCh0aGlzLkRPTUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLnNldHRpbmdzLnRhYkNsYXNzKSk7XG4gICAgICAgIHRoaXMudGl0bGVzID0gW10uc2xpY2UuY2FsbCh0aGlzLkRPTUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLnNldHRpbmdzLnRpdGxlQ2xhc3MpKTtcbiAgICAgICAgdGhpcy50YXJnZXRzID0gdGhpcy50YWJzLm1hcChlbCA9PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5zdWJzdHIoMSkpIHx8IGNvbnNvbGUuZXJyb3IoJ1RhYiB0YXJnZXQgbm90IGZvdW5kJykpO1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLnNldHRpbmdzLmFjdGl2ZTtcblxuICAgICAgICBpZihoYXNoICE9PSBmYWxzZSkgdGhpcy50YXJnZXRzLmZvckVhY2goKHRhcmdldCwgaSkgPT4geyBpZiAodGFyZ2V0LmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gaGFzaCkgdGhpcy5jdXJyZW50ID0gaTsgfSk7XG5cbiAgICAgICAgdGhpcy5pbml0QXJpYSgpO1xuICAgICAgICB0aGlzLmluaXRUaXRsZXMoKTtcbiAgICAgICAgdGhpcy5pbml0VGFicygpO1xuICAgICAgICB0aGlzLm9wZW4odGhpcy5jdXJyZW50KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGluaXRBcmlhKCkge1xuICAgICAgICB0aGlzLnRhYnMuZm9yRWFjaCgoZWwsIGkpID0+IHtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgncm9sZScsICd0YWInKTtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgndGFiSW5kZXgnLCAwKTtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycsIGVsLmdldEF0dHJpYnV0ZSgnaHJlZicpID8gZWwuZ2V0QXR0cmlidXRlKCdocmVmJykuc3Vic3RyKDEpIDogZWwucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoJ2lkJykpO1xuICAgICAgICAgICAgdGhpcy50YXJnZXRzW2ldLnNldEF0dHJpYnV0ZSgncm9sZScsICd0YWJwYW5lbCcpO1xuICAgICAgICAgICAgdGhpcy50YXJnZXRzW2ldLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0c1tpXS5zZXRBdHRyaWJ1dGUoJ3RhYkluZGV4JywgJy0xJyk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGluaXRUaXRsZXMoKSB7XG4gICAgICAgIGxldCBoYW5kbGVyID0gaSA9PiB7IHRoaXMudG9nZ2xlKGkpOyB9O1xuXG4gICAgICAgIHRoaXMudGl0bGVzLmZvckVhY2goKGVsLCBpKSA9PiB7XG4gICAgICAgICAgICBUUklHR0VSX0VWRU5UUy5mb3JFYWNoKGV2ID0+IHtcbiAgICAgICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKGV2LCBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYoZS5rZXlDb2RlICYmIGUua2V5Q29kZSA9PT0gS0VZX0NPREVTLlRBQikgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKCFlLmtleUNvZGUgfHwgZS5rZXlDb2RlID09PSBLRVlfQ09ERVMuRU5URVIgfHwgZS5rZXlDb2RlID09PSBLRVlfQ09ERVMuU1BBQ0Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaW5pdFRhYnMoKSB7XG4gICAgICAgIGxldCBjaGFuZ2UgPSBpZCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGUoaWQpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHsgdGhpcy50YWJzW3RoaXMuY3VycmVudF0uZm9jdXMoKTsgfSwgMTYpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5leHRJZCA9ICgpID0+ICh0aGlzLmN1cnJlbnQgPT09IHRoaXMudGFicy5sZW5ndGggLSAxID8gMCA6IHRoaXMuY3VycmVudCArIDEpLFxuICAgICAgICAgICAgcHJldmlvdXNJZCA9ICgpID0+ICh0aGlzLmN1cnJlbnQgPT09IDAgPyB0aGlzLnRhYnMubGVuZ3RoIC0gMSA6IHRoaXMuY3VycmVudCAtIDEpO1xuXG4gICAgICAgIHRoaXMubGFzdEZvY3VzZWRUYWIgPSAwO1xuXG4gICAgICAgIHRoaXMudGFicy5mb3JFYWNoKChlbCwgaSkgPT4ge1xuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGUgPT4ge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuVVA6XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgcHJldmlvdXNJZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuTEVGVDpcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgcHJldmlvdXNJZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuRE9XTjpcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBuZXh0SWQoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLlJJR0hUOlxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBuZXh0SWQoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLkVOVEVSOlxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuU1BBQ0U6XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgaSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLlRBQjpcbiAgICAgICAgICAgICAgICAgICAgaWYoIXRoaXMuZ2V0Rm9jdXNhYmxlQ2hpbGRyZW4odGhpcy50YXJnZXRzW2ldKS5sZW5ndGgpIHJldHVybjtcblxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdEZvY3VzZWRUYWIgPSB0aGlzLmdldExpbmtJbmRleChlLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VGFyZ2V0Rm9jdXModGhpcy5sYXN0Rm9jdXNlZFRhYik7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZS5jYWxsKHRoaXMsIGkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBpKTtcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBnZXRUYWJJbmRleChsaW5rKXtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMudGFicy5sZW5ndGg7IGkrKykgaWYobGluayA9PT0gdGhpcy50YWJzW2ldKSByZXR1cm4gaTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICBnZXRGb2N1c2FibGVDaGlsZHJlbihub2RlKSB7XG4gICAgICAgIGxldCBmb2N1c2FibGVFbGVtZW50cyA9IFsnYVtocmVmXScsICdhcmVhW2hyZWZdJywgJ2lucHV0Om5vdChbZGlzYWJsZWRdKScsICdzZWxlY3Q6bm90KFtkaXNhYmxlZF0pJywgJ3RleHRhcmVhOm5vdChbZGlzYWJsZWRdKScsICdidXR0b246bm90KFtkaXNhYmxlZF0pJywgJ2lmcmFtZScsICdvYmplY3QnLCAnZW1iZWQnLCAnW2NvbnRlbnRlZGl0YWJsZV0nLCAnW3RhYkluZGV4XTpub3QoW3RhYkluZGV4PVwiLTFcIl0pJ107XG4gICAgICAgIHJldHVybiBbXS5zbGljZS5jYWxsKG5vZGUucXVlcnlTZWxlY3RvckFsbChmb2N1c2FibGVFbGVtZW50cy5qb2luKCcsJykpKTtcbiAgICB9LFxuICAgIHNldFRhcmdldEZvY3VzKHRhYkluZGV4KXtcbiAgICAgICAgdGhpcy5mb2N1c2FibGVDaGlsZHJlbiA9IHRoaXMuZ2V0Rm9jdXNhYmxlQ2hpbGRyZW4odGhpcy50YXJnZXRzW3RhYkluZGV4XSk7XG4gICAgICAgIGlmKCF0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgaWYodGhpcy5mb2N1c2FibGVDaGlsZHJlbi5sZW5ndGgpe1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB0aGlzLmZvY3VzYWJsZUNoaWxkcmVuWzBdLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5rZXlFdmVudExpc3RlbmVyID0gdGhpcy5rZXlMaXN0ZW5lci5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleUV2ZW50TGlzdGVuZXIpO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCAwKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAga2V5TGlzdGVuZXIoZSl7XG4gICAgICAgIGlmIChlLmtleUNvZGUgIT09IEtFWV9DT0RFUy5UQUIpIHJldHVybjtcbiAgICAgICAgXG4gICAgICAgIGxldCBmb2N1c2VkSW5kZXggPSB0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmluZGV4T2YoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XG4gICAgICAgIFxuICAgICAgICBpZihmb2N1c2VkSW5kZXggPCAwKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5rZXlFdmVudExpc3RlbmVyKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYoZS5zaGlmdEtleSAmJiBmb2N1c2VkSW5kZXggPT09IDApIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW5bdGhpcy5mb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggLSAxXS5mb2N1cygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYoIWUuc2hpZnRLZXkgJiYgZm9jdXNlZEluZGV4ID09PSB0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5rZXlFdmVudExpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmxhc3RGb2N1c2VkVGFiICE9PSB0aGlzLnRhYnMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdEZvY3VzZWRUYWIgPSB0aGlzLmxhc3RGb2N1c2VkVGFiICsgMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50YWJzW3RoaXMubGFzdEZvY3VzZWRUYWJdLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBjaGFuZ2UodHlwZSwgaSkge1xuICAgICAgICB0aGlzLnRhYnNbaV0uY2xhc3NMaXN0Wyh0eXBlID09PSAnb3BlbicgPyAnYWRkJyA6ICdyZW1vdmUnKV0odGhpcy5zZXR0aW5ncy5jdXJyZW50Q2xhc3MpO1xuICAgICAgICB0aGlzLnRpdGxlc1tpXS5jbGFzc0xpc3RbKHR5cGUgPT09ICdvcGVuJyA/ICdhZGQnIDogJ3JlbW92ZScpXSh0aGlzLnNldHRpbmdzLmN1cnJlbnRDbGFzcyk7XG4gICAgICAgIHRoaXMudGFyZ2V0c1tpXS5jbGFzc0xpc3RbKHR5cGUgPT09ICdvcGVuJyA/ICdhZGQnIDogJ3JlbW92ZScpXSh0aGlzLnNldHRpbmdzLmN1cnJlbnRDbGFzcyk7XG4gICAgICAgIHRoaXMudGFyZ2V0c1tpXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdGhpcy50YXJnZXRzW2ldLmdldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKSA9PT0gJ3RydWUnID8gJ2ZhbHNlJyA6ICd0cnVlJyApO1xuICAgICAgICB0aGlzLnRhYnNbaV0uc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgdGhpcy50YWJzW2ldLmdldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcpID09PSAndHJ1ZScgPyAnZmFsc2UnIDogJ3RydWUnICk7XG4gICAgICAgIHRoaXMudGFic1tpXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0aGlzLnRhYnNbaV0uZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICd0cnVlJyA/ICdmYWxzZScgOiAndHJ1ZScgKTtcbiAgICAgICAgKHR5cGUgPT09ICdvcGVuJyA/IHRoaXMudGFyZ2V0c1tpXSA6IHRoaXMudGFyZ2V0c1t0aGlzLmN1cnJlbnRdKS5zZXRBdHRyaWJ1dGUoJ3RhYkluZGV4JywgKHR5cGUgPT09ICdvcGVuJyA/ICcwJyA6ICctMScpKTtcbiAgICB9LFxuICAgIG9wZW4oaSkge1xuICAgICAgICB0aGlzLmNoYW5nZSgnb3BlbicsIGkpO1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSBpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGNsb3NlKGkpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2UoJ2Nsb3NlJywgaSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgdG9nZ2xlKGkpIHtcbiAgICAgICAgaWYodGhpcy5jdXJyZW50ID09PSBpKSB7IHJldHVybjsgfVxuICAgICAgICBcbiAgICAgICAgISF3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUgJiYgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHsgVVJMOiB0aGlzLnRhYnNbaV0uZ2V0QXR0cmlidXRlKCdocmVmJykgfSwgJycsIHRoaXMudGFic1tpXS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSk7XG5cbiAgICAgICAgaWYodGhpcy5jdXJyZW50ID09PSBudWxsKSB0aGlzLm9wZW4oaSk7XG4gICAgICAgIGVsc2UgdGhpcy5jbG9zZSh0aGlzLmN1cnJlbnQpLm9wZW4oaSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufTsiLCJleHBvcnQgZGVmYXVsdCB7XG4gICAgdGFiQ2xhc3M6ICcuanMtdGFiLWFjY29yZGlvbi10YWInLFxuICAgIHRpdGxlQ2xhc3M6ICcuanMtdGFiLWFjY29yZGlvbi10aXRsZScsXG4gICAgY3VycmVudENsYXNzOiAnYWN0aXZlJyxcbiAgICBhY3RpdmU6IDBcbn07Il19
