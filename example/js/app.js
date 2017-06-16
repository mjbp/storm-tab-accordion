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
                        _this4.lastFocusedTab = _this4.getTabIndex(e.target);
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

        window.setTimeout(function () {
            this.focusableChildren[0].focus();
            this.keyEventListener = this.keyListener.bind(this);
            document.addEventListener('keydown', this.keyEventListener);
        }.bind(this), 0);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ3RDO3NCQUFBLEFBQWEsS0FBYixBQUFrQixBQUNsQjtBQUZELEFBQWdDLENBQUE7O0FBSWhDLElBQUcsc0JBQUgsQUFBeUIsZUFBUSxBQUFPLGlCQUFQLEFBQXdCLG9CQUFvQixZQUFNLEFBQUU7MEJBQUEsQUFBd0IsUUFBUSxVQUFBLEFBQUMsSUFBRDtXQUFBLEFBQVE7QUFBeEMsQUFBZ0Q7QUFBcEcsQ0FBQTs7Ozs7Ozs7O0FDTmpDOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsS0FBRCxBQUFNLE1BQVMsQUFDM0I7S0FBSSxNQUFNLEdBQUEsQUFBRyxNQUFILEFBQVMsS0FBSyxTQUFBLEFBQVMsaUJBQWpDLEFBQVUsQUFBYyxBQUEwQixBQUVsRDs7S0FBRyxDQUFDLElBQUosQUFBUSxRQUFRLE1BQU0sSUFBQSxBQUFJLE1BQVYsQUFBTSxBQUFVLEFBRWhDOztZQUFPLEFBQUksSUFBSSxVQUFBLEFBQUMsSUFBRDtnQkFBUSxBQUFPLE9BQU8sT0FBQSxBQUFPLDRCQUFyQjtlQUFpRCxBQUMxRCxBQUNaO2FBQVUsT0FBQSxBQUFPLE9BQVAsQUFBYyx3QkFBYyxHQUE1QixBQUErQixTQUZwQixBQUFpRCxBQUU1RCxBQUF3QztBQUZvQixBQUN0RSxHQURxQixFQUFSLEFBQVEsQUFHbkI7QUFISixBQUFPLEFBSVAsRUFKTztBQUxSOztrQkFX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QVUsRUFBRSxLQUFLLEtBQUEsQUFBSyxLQUFMLEFBQVUsR0FBVixBQUFhLGFBQTdDLEFBQXlCLEFBQU8sQUFBMEIsV0FBMUQsQUFBcUUsSUFBSSxLQUFBLEFBQUssS0FBTCxBQUFVLEdBQVYsQUFBYSxhQUFwSCxBQUE4QixBQUF5RSxBQUEwQixBQUVqSTs7WUFBRyxLQUFBLEFBQUssWUFBUixBQUFvQixNQUFNLEtBQUEsQUFBSyxLQUEvQixBQUEwQixBQUFVLFFBQy9CLEtBQUEsQUFBSyxNQUFNLEtBQVgsQUFBZ0IsU0FBaEIsQUFBeUIsS0FBekIsQUFBOEIsQUFFbkM7O2VBQUEsQUFBTyxBQUNWO0EsQUFoTFU7QUFBQSxBQUNYOzs7Ozs7Ozs7Y0NaVyxBQUNELEFBQ1Y7Z0JBRlcsQUFFQyxBQUNaO2tCQUhXLEFBR0csQUFDZDtZLEFBSlcsQUFJSDtBQUpHLEFBQ1giLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFRhYkFjY29yZGlvbiBmcm9tICcuL2xpYnMvY29tcG9uZW50JztcblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkVGFza3MgPSBbKCkgPT4ge1xuXHRUYWJBY2NvcmRpb24uaW5pdCgnLmpzLXRhYi1hY2NvcmRpb24nKTtcbn1dO1xuICAgIFxuaWYoJ2FkZEV2ZW50TGlzdGVuZXInIGluIHdpbmRvdykgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSk7IiwiaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4vbGliL2RlZmF1bHRzJztcbmltcG9ydCBjb21wb25lbnRQcm90b3R5cGUgZnJvbSAnLi9saWIvY29tcG9uZW50LXByb3RvdHlwZSc7XG5cbmNvbnN0IGluaXQgPSAoc2VsLCBvcHRzKSA9PiB7XG5cdGxldCBlbHMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKSk7XG5cdFxuXHRpZighZWxzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCdUYWIgQWNjb3JkaW9uIGNhbm5vdCBiZSBpbml0aWFsaXNlZCwgbm8gYXVnbWVudGFibGUgZWxlbWVudHMgZm91bmQnKTtcblxuXHRyZXR1cm4gZWxzLm1hcCgoZWwpID0+IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShjb21wb25lbnRQcm90b3R5cGUpLCB7XG5cdFx0XHRET01FbGVtZW50OiBlbCxcblx0XHRcdHNldHRpbmdzOiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgZWwuZGF0YXNldCwgb3B0cylcblx0XHR9KS5pbml0KCkpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgeyBpbml0IH07IiwiY29uc3QgS0VZX0NPREVTID0ge1xuICAgICAgICAgICAgU1BBQ0U6IDMyLFxuICAgICAgICAgICAgRU5URVI6IDEzLFxuICAgICAgICAgICAgVEFCOiA5LFxuICAgICAgICAgICAgTEVGVDogMzcsXG4gICAgICAgICAgICBSSUdIVDogMzksXG4gICAgICAgICAgICBVUDozOCxcbiAgICAgICAgICAgIERPV046IDQwXG4gICAgICAgIH0sXG4gICAgICAgIFRSSUdHRVJfRVZFTlRTID0gW3dpbmRvdy5Qb2ludGVyRXZlbnQgPyAncG9pbnRlcmRvd24nIDogJ29udG91Y2hzdGFydCcgaW4gd2luZG93ID8gJ3RvdWNoc3RhcnQnIDogJ2NsaWNrJywgJ2tleWRvd24nIF07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBpbml0KCkge1xuICAgICAgICBsZXQgaGFzaCA9IGxvY2F0aW9uLmhhc2guc2xpY2UoMSkgfHwgZmFsc2U7XG5cbiAgICAgICAgdGhpcy50YWJzID0gW10uc2xpY2UuY2FsbCh0aGlzLkRPTUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLnNldHRpbmdzLnRhYkNsYXNzKSk7XG4gICAgICAgIHRoaXMudGl0bGVzID0gW10uc2xpY2UuY2FsbCh0aGlzLkRPTUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLnNldHRpbmdzLnRpdGxlQ2xhc3MpKTtcbiAgICAgICAgdGhpcy50YXJnZXRzID0gdGhpcy50YWJzLm1hcChlbCA9PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5zdWJzdHIoMSkpIHx8IGNvbnNvbGUuZXJyb3IoJ1RhYiB0YXJnZXQgbm90IGZvdW5kJykpO1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLnNldHRpbmdzLmFjdGl2ZTtcblxuICAgICAgICBpZihoYXNoICE9PSBmYWxzZSkgdGhpcy50YXJnZXRzLmZvckVhY2goKHRhcmdldCwgaSkgPT4geyBpZiAodGFyZ2V0LmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gaGFzaCkgdGhpcy5jdXJyZW50ID0gaTsgfSk7XG5cbiAgICAgICAgdGhpcy5pbml0QXJpYSgpO1xuICAgICAgICB0aGlzLmluaXRUaXRsZXMoKTtcbiAgICAgICAgdGhpcy5pbml0VGFicygpO1xuICAgICAgICB0aGlzLm9wZW4odGhpcy5jdXJyZW50KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGluaXRBcmlhKCkge1xuICAgICAgICB0aGlzLnRhYnMuZm9yRWFjaCgoZWwsIGkpID0+IHtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgncm9sZScsICd0YWInKTtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgndGFiSW5kZXgnLCAwKTtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycsIGVsLmdldEF0dHJpYnV0ZSgnaHJlZicpID8gZWwuZ2V0QXR0cmlidXRlKCdocmVmJykuc3Vic3RyKDEpIDogZWwucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoJ2lkJykpO1xuICAgICAgICAgICAgdGhpcy50YXJnZXRzW2ldLnNldEF0dHJpYnV0ZSgncm9sZScsICd0YWJwYW5lbCcpO1xuICAgICAgICAgICAgdGhpcy50YXJnZXRzW2ldLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0c1tpXS5zZXRBdHRyaWJ1dGUoJ3RhYkluZGV4JywgJy0xJyk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGluaXRUaXRsZXMoKSB7XG4gICAgICAgIGxldCBoYW5kbGVyID0gaSA9PiB7IHRoaXMudG9nZ2xlKGkpOyB9O1xuXG4gICAgICAgIHRoaXMudGl0bGVzLmZvckVhY2goKGVsLCBpKSA9PiB7XG4gICAgICAgICAgICBUUklHR0VSX0VWRU5UUy5mb3JFYWNoKGV2ID0+IHtcbiAgICAgICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKGV2LCBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYoZS5rZXlDb2RlICYmIGUua2V5Q29kZSA9PT0gS0VZX0NPREVTLlRBQikgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKCFlLmtleUNvZGUgfHwgZS5rZXlDb2RlID09PSBLRVlfQ09ERVMuRU5URVIgfHwgZS5rZXlDb2RlID09PSBLRVlfQ09ERVMuU1BBQ0Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaW5pdFRhYnMoKSB7XG4gICAgICAgIGxldCBjaGFuZ2UgPSBpZCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGUoaWQpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHsgdGhpcy50YWJzW3RoaXMuY3VycmVudF0uZm9jdXMoKTsgfSwgMTYpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5leHRJZCA9ICgpID0+ICh0aGlzLmN1cnJlbnQgPT09IHRoaXMudGFicy5sZW5ndGggLSAxID8gMCA6IHRoaXMuY3VycmVudCArIDEpLFxuICAgICAgICAgICAgcHJldmlvdXNJZCA9ICgpID0+ICh0aGlzLmN1cnJlbnQgPT09IDAgPyB0aGlzLnRhYnMubGVuZ3RoIC0gMSA6IHRoaXMuY3VycmVudCAtIDEpO1xuXG4gICAgICAgIHRoaXMubGFzdEZvY3VzZWRUYWIgPSAwO1xuXG4gICAgICAgIHRoaXMudGFicy5mb3JFYWNoKChlbCwgaSkgPT4ge1xuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGUgPT4ge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuVVA6XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgcHJldmlvdXNJZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuTEVGVDpcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgcHJldmlvdXNJZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuRE9XTjpcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBuZXh0SWQoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLlJJR0hUOlxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBuZXh0SWQoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLkVOVEVSOlxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuU1BBQ0U6XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgaSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLlRBQjpcbiAgICAgICAgICAgICAgICAgICAgaWYoIXRoaXMuZ2V0Rm9jdXNhYmxlQ2hpbGRyZW4odGhpcy50YXJnZXRzW2ldKS5sZW5ndGgpIHJldHVybjtcblxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdEZvY3VzZWRUYWIgPSB0aGlzLmdldFRhYkluZGV4KGUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRUYXJnZXRGb2N1cyh0aGlzLmxhc3RGb2N1c2VkVGFiKTtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgaSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGNoYW5nZS5jYWxsKHRoaXMsIGkpO1xuICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGdldFRhYkluZGV4KGxpbmspe1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy50YWJzLmxlbmd0aDsgaSsrKSBpZihsaW5rID09PSB0aGlzLnRhYnNbaV0pIHJldHVybiBpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIGdldEZvY3VzYWJsZUNoaWxkcmVuKG5vZGUpIHtcbiAgICAgICAgbGV0IGZvY3VzYWJsZUVsZW1lbnRzID0gWydhW2hyZWZdJywgJ2FyZWFbaHJlZl0nLCAnaW5wdXQ6bm90KFtkaXNhYmxlZF0pJywgJ3NlbGVjdDpub3QoW2Rpc2FibGVkXSknLCAndGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pJywgJ2J1dHRvbjpub3QoW2Rpc2FibGVkXSknLCAnaWZyYW1lJywgJ29iamVjdCcsICdlbWJlZCcsICdbY29udGVudGVkaXRhYmxlXScsICdbdGFiSW5kZXhdOm5vdChbdGFiSW5kZXg9XCItMVwiXSknXTtcbiAgICAgICAgcmV0dXJuIFtdLnNsaWNlLmNhbGwobm9kZS5xdWVyeVNlbGVjdG9yQWxsKGZvY3VzYWJsZUVsZW1lbnRzLmpvaW4oJywnKSkpO1xuICAgIH0sXG4gICAgc2V0VGFyZ2V0Rm9jdXModGFiSW5kZXgpe1xuICAgICAgICB0aGlzLmZvY3VzYWJsZUNoaWxkcmVuID0gdGhpcy5nZXRGb2N1c2FibGVDaGlsZHJlbih0aGlzLnRhcmdldHNbdGFiSW5kZXhdKTtcbiAgICAgICAgaWYoIXRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIFxuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhpcy5mb2N1c2FibGVDaGlsZHJlblswXS5mb2N1cygpO1xuICAgICAgICAgICAgdGhpcy5rZXlFdmVudExpc3RlbmVyID0gdGhpcy5rZXlMaXN0ZW5lci5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMua2V5RXZlbnRMaXN0ZW5lcik7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgMCk7XG4gICAgfSxcbiAgICBrZXlMaXN0ZW5lcihlKXtcbiAgICAgICAgaWYgKGUua2V5Q29kZSAhPT0gS0VZX0NPREVTLlRBQikgcmV0dXJuO1xuICAgICAgICBcbiAgICAgICAgbGV0IGZvY3VzZWRJbmRleCA9IHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4uaW5kZXhPZihkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcbiAgICAgICAgXG4gICAgICAgIGlmKGZvY3VzZWRJbmRleCA8IDApIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleUV2ZW50TGlzdGVuZXIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZihlLnNoaWZ0S2V5ICYmIGZvY3VzZWRJbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5mb2N1c2FibGVDaGlsZHJlblt0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAtIDFdLmZvY3VzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZighZS5zaGlmdEtleSAmJiBmb2N1c2VkSW5kZXggPT09IHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleUV2ZW50TGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMubGFzdEZvY3VzZWRUYWIgIT09IHRoaXMudGFicy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0Rm9jdXNlZFRhYiA9IHRoaXMubGFzdEZvY3VzZWRUYWIgKyAxO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRhYnNbdGhpcy5sYXN0Rm9jdXNlZFRhYl0uZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNoYW5nZSh0eXBlLCBpKSB7XG4gICAgICAgIHRoaXMudGFic1tpXS5jbGFzc0xpc3RbKHR5cGUgPT09ICdvcGVuJyA/ICdhZGQnIDogJ3JlbW92ZScpXSh0aGlzLnNldHRpbmdzLmN1cnJlbnRDbGFzcyk7XG4gICAgICAgIHRoaXMudGl0bGVzW2ldLmNsYXNzTGlzdFsodHlwZSA9PT0gJ29wZW4nID8gJ2FkZCcgOiAncmVtb3ZlJyldKHRoaXMuc2V0dGluZ3MuY3VycmVudENsYXNzKTtcbiAgICAgICAgdGhpcy50YXJnZXRzW2ldLmNsYXNzTGlzdFsodHlwZSA9PT0gJ29wZW4nID8gJ2FkZCcgOiAncmVtb3ZlJyldKHRoaXMuc2V0dGluZ3MuY3VycmVudENsYXNzKTtcbiAgICAgICAgdGhpcy50YXJnZXRzW2ldLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0aGlzLnRhcmdldHNbaV0uZ2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicpID09PSAndHJ1ZScgPyAnZmFsc2UnIDogJ3RydWUnICk7XG4gICAgICAgIHRoaXMudGFic1tpXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCB0aGlzLnRhYnNbaV0uZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJyA/ICdmYWxzZScgOiAndHJ1ZScgKTtcbiAgICAgICAgdGhpcy50YWJzW2ldLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIHRoaXMudGFic1tpXS5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ3RydWUnID8gJ2ZhbHNlJyA6ICd0cnVlJyApO1xuICAgICAgICAodHlwZSA9PT0gJ29wZW4nID8gdGhpcy50YXJnZXRzW2ldIDogdGhpcy50YXJnZXRzW3RoaXMuY3VycmVudF0pLnNldEF0dHJpYnV0ZSgndGFiSW5kZXgnLCAodHlwZSA9PT0gJ29wZW4nID8gJzAnIDogJy0xJykpO1xuICAgIH0sXG4gICAgb3BlbihpKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlKCdvcGVuJywgaSk7XG4gICAgICAgIHRoaXMuY3VycmVudCA9IGk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgY2xvc2UoaSkge1xuICAgICAgICB0aGlzLmNoYW5nZSgnY2xvc2UnLCBpKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICB0b2dnbGUoaSkge1xuICAgICAgICBpZih0aGlzLmN1cnJlbnQgPT09IGkpIHsgcmV0dXJuOyB9XG4gICAgICAgIFxuICAgICAgICAhIXdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSAmJiB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoeyBVUkw6IHRoaXMudGFic1tpXS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSB9LCAnJywgdGhpcy50YWJzW2ldLmdldEF0dHJpYnV0ZSgnaHJlZicpKTtcblxuICAgICAgICBpZih0aGlzLmN1cnJlbnQgPT09IG51bGwpIHRoaXMub3BlbihpKTtcbiAgICAgICAgZWxzZSB0aGlzLmNsb3NlKHRoaXMuY3VycmVudCkub3BlbihpKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59OyIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICB0YWJDbGFzczogJy5qcy10YWItYWNjb3JkaW9uLXRhYicsXG4gICAgdGl0bGVDbGFzczogJy5qcy10YWItYWNjb3JkaW9uLXRpdGxlJyxcbiAgICBjdXJyZW50Q2xhc3M6ICdhY3RpdmUnLFxuICAgIGFjdGl2ZTogMFxufTsiXX0=
