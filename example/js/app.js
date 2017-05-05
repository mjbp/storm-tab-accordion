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
};

exports.default = {
    init: function init() {
        var _this = this;

        var hash = location.hash.slice(1) || null;
        this.tabs = [].slice.call(this.DOMElement.querySelectorAll(this.settings.tabClass));
        this.titles = [].slice.call(this.DOMElement.querySelectorAll(this.settings.titleClass));

        this.targets = this.tabs.map(function (el) {
            return document.getElementById(el.getAttribute('href').substr(1)) || console.error('Tab target not found');
        });

        this.current = this.settings.active;
        if (hash) {
            this.targets.forEach(function (target, i) {
                if (target.getAttribute('id') === hash) {
                    _this.current = i;
                }
            });
        }
        this.initAria();
        this.initTitles();
        this.initTabs();
        this.open(this.current);

        return this;
    },
    initAria: function initAria() {
        this.tabs.forEach(function (el) {
            el.setAttribute('role', 'tab');
            el.setAttribute('tabIndex', 0);
            el.setAttribute('aria-expanded', false);
            el.setAttribute('aria-selected', false);
            el.setAttribute('aria-controls', el.getAttribute('href') ? el.getAttribute('href').substr(1) : el.parentNode.getAttribute('id'));
        });
        this.targets.forEach(function (el) {
            el.setAttribute('role', 'tabpanel');
            el.setAttribute('aria-hidden', true);
            el.setAttribute('tabIndex', '-1');
        });
        return this;
    },
    initTitles: function initTitles() {
        var _this2 = this;

        var handler = function handler(i) {
            _this2.toggle(i);
        };

        this.titles.forEach(function (el, i) {
            el.addEventListener(_this2.settings.tabCursorEvent, function (e) {
                if (!!e.keyCode && e.keyCode === KEY_CODES.TAB) return;

                if (!e.keyCode || e.keyCode === KEY_CODES.ENTER) {
                    e.preventDefault();
                    handler.call(_this2, i);
                }
            }, false);
        });

        return this;
    },
    initTabs: function initTabs() {
        var _this3 = this;

        var handler = function handler(i) {
            _this3.toggle(i);
        };

        this.lastFocusedTab = 0;

        this.tabs.forEach(function (el, i) {
            //navigate
            el.addEventListener('keydown', function (e) {
                switch (e.keyCode) {
                    case KEY_CODES.UP:
                        e.preventDefault();
                        _this3.toggle(_this3.current === 0 ? _this3.tabs.length - 1 : _this3.current - 1);
                        window.setTimeout(function () {
                            _this3.tabs[_this3.current].focus();
                        }, 16);
                        break;
                    case KEY_CODES.LEFT:
                        _this3.toggle(_this3.current === 0 ? _this3.tabs.length - 1 : _this3.current - 1);
                        window.setTimeout(function () {
                            _this3.tabs[_this3.current].focus();
                        }, 16);
                        break;
                    case KEY_CODES.DOWN:
                        e.preventDefault();
                        _this3.toggle(_this3.current === _this3.tabs.length - 1 ? 0 : _this3.current + 1);
                        window.setTimeout(function () {
                            _this3.tabs[_this3.current].focus();
                        }, 16);
                        break;
                    case KEY_CODES.RIGHT:
                        _this3.toggle(_this3.current === _this3.tabs.length - 1 ? 0 : _this3.current + 1);
                        window.setTimeout(function () {
                            _this3.tabs[_this3.current].focus();
                        }, 16);
                        break;
                    case KEY_CODES.ENTER:
                        handler.call(_this3, i);
                        window.setTimeout(function () {
                            _this3.tabs[i].focus();
                        }, 16);
                        break;
                    case KEY_CODES.SPACE:
                        e.preventDefault();
                        _this3.toggle(i);
                        window.setTimeout(function () {
                            _this3.tabs[i].focus();
                        }, 16);
                        break;
                    case KEY_CODES.TAB:
                        e.preventDefault();
                        e.stopPropagation();
                        _this3.lastFocusedTab = _this3.getTabIndex(e.target);
                        _this3.setTargetFocus(_this3.lastFocusedTab);
                        handler.call(_this3, i);
                        break;
                    default:
                        //
                        break;
                }
            });

            //toggle
            el.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                handler.call(_this3, i);
            }, false);
        });

        return this;
    },
    getTabIndex: function getTabIndex(link) {
        for (var i = 0; i < this.tabs.length; i++) {
            if (link === this.tabs[i]) return i;
        }
        return null;
    },
    getFocusableChildren: function getFocusableChildren(node) {
        var focusableElements = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabIndex]:not([tabIndex="-1"])'];
        return [].slice.call(node.querySelectorAll(focusableElements.join(',')));
    },
    setTargetFocus: function setTargetFocus(tabIndex) {
        this.focusableChildren = this.getFocusableChildren(this.targets[tabIndex]);

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
        var methods = {
            open: {
                classlist: 'add',
                tabIndex: {
                    target: this.targets[i],
                    value: '0'
                }
            },
            close: {
                classlist: 'remove',
                tabIndex: {
                    target: this.targets[this.current],
                    value: '-1'
                }
            }
        };

        this.tabs[i].classList[methods[type].classlist](this.settings.currentClass);
        this.titles[i].classList[methods[type].classlist](this.settings.currentClass);
        this.targets[i].classList[methods[type].classlist](this.settings.currentClass);

        this.targets[i].setAttribute('aria-hidden', this.targets[i].getAttribute('aria-hidden') === 'true' ? 'false' : 'true');
        this.tabs[i].setAttribute('aria-selected', this.tabs[i].getAttribute('aria-selected') === 'true' ? 'false' : 'true');
        this.tabs[i].setAttribute('aria-expanded', this.tabs[i].getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
        methods[type].tabIndex.target.setAttribute('tabIndex', methods[type].tabIndex.value);
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
        if (this.current === null) {
            this.open(i);
            return this;
        }
        this.close(this.current).open(i);
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
    active: 0,
    tabCursorEvent: 'click'
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ3RDO3NCQUFBLEFBQWEsS0FBYixBQUFrQixBQUNsQjtBQUZELEFBQWdDLENBQUE7O0FBSWhDLElBQUcsc0JBQUgsQUFBeUIsZUFBUSxBQUFPLGlCQUFQLEFBQXdCLG9CQUFvQixZQUFNLEFBQUU7MEJBQUEsQUFBd0IsUUFBUSxVQUFBLEFBQUMsSUFBRDtXQUFBLEFBQVE7QUFBeEMsQUFBZ0Q7QUFBcEcsQ0FBQTs7Ozs7Ozs7O0FDTmpDOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsS0FBRCxBQUFNLE1BQVMsQUFDM0I7S0FBSSxNQUFNLEdBQUEsQUFBRyxNQUFILEFBQVMsS0FBSyxTQUFBLEFBQVMsaUJBQWpDLEFBQVUsQUFBYyxBQUEwQixBQUVsRDs7S0FBRyxDQUFDLElBQUosQUFBUSxRQUFRLE1BQU0sSUFBQSxBQUFJLE1BQVYsQUFBTSxBQUFVLEFBRWhDOztZQUFPLEFBQUksSUFBSSxVQUFBLEFBQUMsSUFBTyxBQUN0QjtnQkFBTyxBQUFPLE9BQU8sT0FBQSxBQUFPLDRCQUFyQjtlQUFpRCxBQUMzQyxBQUNaO2FBQVUsT0FBQSxBQUFPLE9BQVAsQUFBYyx3QkFGbEIsQUFBaUQsQUFFN0MsQUFBNEI7QUFGaUIsQUFDdkQsR0FETSxFQUFQLEFBQU8sQUFHSixBQUNIO0FBTEQsQUFBTyxBQU1QLEVBTk87QUFMUjs7a0JBYWUsRUFBRSxN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QUF1QixPQUF2QixBQUE4QixhQUE5QixBQUEyQyxZQUFZLFFBQUEsQUFBUSxNQUFSLEFBQWMsU0FBckUsQUFBOEUsQUFFakY7QUFqTVUsQUFrTVg7QUFsTVcsd0JBQUEsQUFrTU4sR0FBRyxBQUNKO2FBQUEsQUFBSyxPQUFMLEFBQVksUUFBWixBQUFvQixBQUNwQjthQUFBLEFBQUssVUFBTCxBQUFlLEFBQ2Y7ZUFBQSxBQUFPLEFBQ1Y7QUF0TVUsQUF1TVg7QUF2TVcsMEJBQUEsQUF1TUwsR0FBRyxBQUNMO2FBQUEsQUFBSyxPQUFMLEFBQVksU0FBWixBQUFxQixBQUNyQjtlQUFBLEFBQU8sQUFDVjtBQTFNVSxBQTJNWDtBQTNNVyw0QkFBQSxBQTJNSixHQUFHLEFBQ047WUFBRyxLQUFBLEFBQUssWUFBUixBQUFvQixHQUFHLEFBQUU7QUFBUztBQUVsQzs7U0FBQyxDQUFDLE9BQUEsQUFBTyxRQUFULEFBQWlCLGFBQWEsT0FBQSxBQUFPLFFBQVAsQUFBZSxVQUFVLEVBQUUsS0FBSyxLQUFBLEFBQUssS0FBTCxBQUFVLEdBQVYsQUFBYSxhQUE3QyxBQUF5QixBQUFPLEFBQTBCLFdBQTFELEFBQXFFLElBQUksS0FBQSxBQUFLLEtBQUwsQUFBVSxHQUFWLEFBQWEsYUFBcEgsQUFBOEIsQUFBeUUsQUFBMEIsQUFDakk7WUFBRyxLQUFBLEFBQUssWUFBUixBQUFvQixNQUFNLEFBQ3RCO2lCQUFBLEFBQUssS0FBTCxBQUFVLEFBQ1Y7bUJBQUEsQUFBTyxBQUNWO0FBQ0Q7YUFBQSxBQUFLLE1BQU0sS0FBWCxBQUFnQixTQUFoQixBQUNLLEtBREwsQUFDVSxBQUNWO2VBQUEsQUFBTyxBQUNWO0EsQUF0TlU7QUFBQSxBQUNYOzs7Ozs7Ozs7Y0NYVyxBQUNELEFBQ1Y7Z0JBRlcsQUFFQyxBQUNaO2tCQUhXLEFBR0csQUFDZDtZQUpXLEFBSUgsQUFDUjtvQixBQUxXLEFBS0s7QUFMTCxBQUNYIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBUYWJBY2NvcmRpb24gZnJvbSAnLi9saWJzL2NvbXBvbmVudCc7XG5cbmNvbnN0IG9uRE9NQ29udGVudExvYWRlZFRhc2tzID0gWygpID0+IHtcblx0VGFiQWNjb3JkaW9uLmluaXQoJy5qcy10YWItYWNjb3JkaW9uJyk7XG59XTtcbiAgICBcbmlmKCdhZGRFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cpIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4geyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKChmbikgPT4gZm4oKSk7IH0pOyIsImltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2xpYi9kZWZhdWx0cyc7XG5pbXBvcnQgY29tcG9uZW50UHJvdG90eXBlIGZyb20gJy4vbGliL2NvbXBvbmVudC1wcm90b3R5cGUnO1xuXG5jb25zdCBpbml0ID0gKHNlbCwgb3B0cykgPT4ge1xuXHRsZXQgZWxzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpO1xuXHRcblx0aWYoIWVscy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignVGFiIEFjY29yZGlvbiBjYW5ub3QgYmUgaW5pdGlhbGlzZWQsIG5vIGF1Z21lbnRhYmxlIGVsZW1lbnRzIGZvdW5kJyk7XG5cblx0cmV0dXJuIGVscy5tYXAoKGVsKSA9PiB7XG5cdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShjb21wb25lbnRQcm90b3R5cGUpLCB7XG5cdFx0XHRET01FbGVtZW50OiBlbCxcblx0XHRcdHNldHRpbmdzOiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0cylcblx0XHR9KS5pbml0KCk7XG5cdH0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgeyBpbml0IH07IiwiY29uc3QgS0VZX0NPREVTID0ge1xuICAgICAgICAgICAgU1BBQ0U6IDMyLFxuICAgICAgICAgICAgRU5URVI6IDEzLFxuICAgICAgICAgICAgVEFCOiA5LFxuICAgICAgICAgICAgTEVGVDogMzcsXG4gICAgICAgICAgICBSSUdIVDogMzksXG4gICAgICAgICAgICBVUDozOCxcbiAgICAgICAgICAgIERPV046IDQwXG4gICAgICAgIH07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBpbml0KCkge1xuICAgICAgICBsZXQgaGFzaCA9IGxvY2F0aW9uLmhhc2guc2xpY2UoMSkgfHwgbnVsbDtcbiAgICAgICAgdGhpcy50YWJzID0gW10uc2xpY2UuY2FsbCh0aGlzLkRPTUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLnNldHRpbmdzLnRhYkNsYXNzKSk7XG4gICAgICAgIHRoaXMudGl0bGVzID0gW10uc2xpY2UuY2FsbCh0aGlzLkRPTUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLnNldHRpbmdzLnRpdGxlQ2xhc3MpKTtcblxuICAgICAgICB0aGlzLnRhcmdldHMgPSB0aGlzLnRhYnMubWFwKGVsID0+IHtcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5zdWJzdHIoMSkpIHx8IGNvbnNvbGUuZXJyb3IoJ1RhYiB0YXJnZXQgbm90IGZvdW5kJyk7XG4gICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgIHRoaXMuY3VycmVudCA9IHRoaXMuc2V0dGluZ3MuYWN0aXZlO1xuICAgICAgICBpZiAoaGFzaCkge1xuICAgICAgICAgICAgdGhpcy50YXJnZXRzLmZvckVhY2goKHRhcmdldCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQuZ2V0QXR0cmlidXRlKCdpZCcpID09PSBoYXNoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbml0QXJpYSgpO1xuICAgICAgICB0aGlzLmluaXRUaXRsZXMoKTtcbiAgICAgICAgdGhpcy5pbml0VGFicygpO1xuICAgICAgICB0aGlzLm9wZW4odGhpcy5jdXJyZW50KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGluaXRBcmlhKCkge1xuICAgICAgICB0aGlzLnRhYnMuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndGFiJyk7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ3RhYkluZGV4JywgMCk7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnLCBlbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSA/IGVsLmdldEF0dHJpYnV0ZSgnaHJlZicpLnN1YnN0cigxKSA6IGVsLnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKCdpZCcpKTtcblxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50YXJnZXRzLmZvckVhY2goZWwgPT4ge1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYnBhbmVsJyk7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ3RhYkluZGV4JywgJy0xJyk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGluaXRUaXRsZXMoKSB7XG4gICAgICAgIGxldCBoYW5kbGVyID0gaSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZShpKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnRpdGxlcy5mb3JFYWNoKChlbCwgaSkgPT4ge1xuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLnNldHRpbmdzLnRhYkN1cnNvckV2ZW50LCBlID0+IHtcbiAgICAgICAgICAgICAgICBpZighIWUua2V5Q29kZSAmJiBlLmtleUNvZGUgPT09IEtFWV9DT0RFUy5UQUIpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIGlmKCFlLmtleUNvZGUgfHwgZS5rZXlDb2RlID09PSBLRVlfQ09ERVMuRU5URVIpe1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaW5pdFRhYnMoKSB7XG4gICAgICAgIGxldCBoYW5kbGVyID0gaSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZShpKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmxhc3RGb2N1c2VkVGFiID0gMDtcblxuICAgICAgICB0aGlzLnRhYnMuZm9yRWFjaCgoZWwsIGkpID0+IHtcbiAgICAgICAgICAgIC8vbmF2aWdhdGVcbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBlID0+IHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLlVQOlxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlKCh0aGlzLmN1cnJlbnQgPT09IDAgPyB0aGlzLnRhYnMubGVuZ3RoIC0gMSA6IHRoaXMuY3VycmVudCAtIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnRhYnNbdGhpcy5jdXJyZW50XS5mb2N1cygpOyB9LCAxNik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLkxFRlQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlKCh0aGlzLmN1cnJlbnQgPT09IDAgPyB0aGlzLnRhYnMubGVuZ3RoIC0gMSA6IHRoaXMuY3VycmVudCAtIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnRhYnNbdGhpcy5jdXJyZW50XS5mb2N1cygpOyB9LCAxNik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLkRPV046XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b2dnbGUoKHRoaXMuY3VycmVudCA9PT0gdGhpcy50YWJzLmxlbmd0aCAtIDEgPyAwIDogdGhpcy5jdXJyZW50ICsgMSkpO1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IHRoaXMudGFic1t0aGlzLmN1cnJlbnRdLmZvY3VzKCk7IH0sIDE2KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuUklHSFQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlKCh0aGlzLmN1cnJlbnQgPT09IHRoaXMudGFicy5sZW5ndGggLSAxID8gMCA6IHRoaXMuY3VycmVudCArIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnRhYnNbdGhpcy5jdXJyZW50XS5mb2N1cygpOyB9LCAxNik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLkVOVEVSOlxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgaSk7ICBcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnRhYnNbaV0uZm9jdXMoKTsgfSwgMTYpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5TUEFDRTpcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZShpKTtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnRhYnNbaV0uZm9jdXMoKTsgfSwgMTYpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5UQUI6XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0Rm9jdXNlZFRhYiA9IHRoaXMuZ2V0VGFiSW5kZXgoZS50YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFRhcmdldEZvY3VzKHRoaXMubGFzdEZvY3VzZWRUYWIpO1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgaSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy90b2dnbGVcbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGkpO1xuICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGdldFRhYkluZGV4KGxpbmspe1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy50YWJzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGlmKGxpbmsgPT09IHRoaXMudGFic1tpXSkgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICBnZXRGb2N1c2FibGVDaGlsZHJlbihub2RlKSB7XG4gICAgICAgIGxldCBmb2N1c2FibGVFbGVtZW50cyA9IFsnYVtocmVmXScsICdhcmVhW2hyZWZdJywgJ2lucHV0Om5vdChbZGlzYWJsZWRdKScsICdzZWxlY3Q6bm90KFtkaXNhYmxlZF0pJywgJ3RleHRhcmVhOm5vdChbZGlzYWJsZWRdKScsICdidXR0b246bm90KFtkaXNhYmxlZF0pJywgJ2lmcmFtZScsICdvYmplY3QnLCAnZW1iZWQnLCAnW2NvbnRlbnRlZGl0YWJsZV0nLCAnW3RhYkluZGV4XTpub3QoW3RhYkluZGV4PVwiLTFcIl0pJ107XG4gICAgICAgIHJldHVybiBbXS5zbGljZS5jYWxsKG5vZGUucXVlcnlTZWxlY3RvckFsbChmb2N1c2FibGVFbGVtZW50cy5qb2luKCcsJykpKTtcbiAgICB9LFxuICAgIHNldFRhcmdldEZvY3VzKHRhYkluZGV4KXtcbiAgICAgICAgdGhpcy5mb2N1c2FibGVDaGlsZHJlbiA9IHRoaXMuZ2V0Rm9jdXNhYmxlQ2hpbGRyZW4odGhpcy50YXJnZXRzW3RhYkluZGV4XSk7XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCl7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW5bMF0uZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmtleUV2ZW50TGlzdGVuZXIgPSB0aGlzLmtleUxpc3RlbmVyLmJpbmQodGhpcyk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMua2V5RXZlbnRMaXN0ZW5lcik7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksIDApO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBrZXlMaXN0ZW5lcihlKXtcbiAgICAgICAgaWYgKGUua2V5Q29kZSAhPT0gS0VZX0NPREVTLlRBQikgcmV0dXJuO1xuICAgICAgICBcbiAgICAgICAgbGV0IGZvY3VzZWRJbmRleCA9IHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4uaW5kZXhPZihkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcbiAgICAgICAgXG4gICAgICAgIGlmKGZvY3VzZWRJbmRleCA8IDApIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleUV2ZW50TGlzdGVuZXIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZihlLnNoaWZ0S2V5ICYmIGZvY3VzZWRJbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5mb2N1c2FibGVDaGlsZHJlblt0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAtIDFdLmZvY3VzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZighZS5zaGlmdEtleSAmJiBmb2N1c2VkSW5kZXggPT09IHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleUV2ZW50TGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMubGFzdEZvY3VzZWRUYWIgIT09IHRoaXMudGFicy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0Rm9jdXNlZFRhYiA9IHRoaXMubGFzdEZvY3VzZWRUYWIgKyAxO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRhYnNbdGhpcy5sYXN0Rm9jdXNlZFRhYl0uZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNoYW5nZSh0eXBlLCBpKSB7XG4gICAgICAgIGxldCBtZXRob2RzID0ge1xuICAgICAgICAgICAgb3Blbjoge1xuICAgICAgICAgICAgICAgIGNsYXNzbGlzdDogJ2FkZCcsXG4gICAgICAgICAgICAgICAgdGFiSW5kZXg6IHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiB0aGlzLnRhcmdldHNbaV0sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAnMCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2xvc2U6IHtcbiAgICAgICAgICAgICAgICBjbGFzc2xpc3Q6ICdyZW1vdmUnLFxuICAgICAgICAgICAgICAgIHRhYkluZGV4OiB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogdGhpcy50YXJnZXRzW3RoaXMuY3VycmVudF0sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAnLTEnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMudGFic1tpXS5jbGFzc0xpc3RbbWV0aG9kc1t0eXBlXS5jbGFzc2xpc3RdKHRoaXMuc2V0dGluZ3MuY3VycmVudENsYXNzKTtcbiAgICAgICAgdGhpcy50aXRsZXNbaV0uY2xhc3NMaXN0W21ldGhvZHNbdHlwZV0uY2xhc3NsaXN0XSh0aGlzLnNldHRpbmdzLmN1cnJlbnRDbGFzcyk7XG4gICAgICAgIHRoaXMudGFyZ2V0c1tpXS5jbGFzc0xpc3RbbWV0aG9kc1t0eXBlXS5jbGFzc2xpc3RdKHRoaXMuc2V0dGluZ3MuY3VycmVudENsYXNzKTtcblxuICAgICAgICB0aGlzLnRhcmdldHNbaV0uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRoaXMudGFyZ2V0c1tpXS5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykgPT09ICd0cnVlJyA/ICdmYWxzZScgOiAndHJ1ZScpO1xuICAgICAgICB0aGlzLnRhYnNbaV0uc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgdGhpcy50YWJzW2ldLmdldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcpID09PSAndHJ1ZScgPyAnZmFsc2UnIDogJ3RydWUnKTtcbiAgICAgICAgdGhpcy50YWJzW2ldLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIHRoaXMudGFic1tpXS5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ3RydWUnID8gJ2ZhbHNlJyA6ICd0cnVlJyk7XG4gICAgICAgIG1ldGhvZHNbdHlwZV0udGFiSW5kZXgudGFyZ2V0LnNldEF0dHJpYnV0ZSgndGFiSW5kZXgnLCBtZXRob2RzW3R5cGVdLnRhYkluZGV4LnZhbHVlKTtcbiAgICAgICAgXG4gICAgfSxcbiAgICBvcGVuKGkpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2UoJ29wZW4nLCBpKTtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gaTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjbG9zZShpKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlKCdjbG9zZScsIGkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHRvZ2dsZShpKSB7XG4gICAgICAgIGlmKHRoaXMuY3VycmVudCA9PT0gaSkgeyByZXR1cm47IH1cbiAgICAgICAgXG4gICAgICAgICEhd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlICYmIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7IFVSTDogdGhpcy50YWJzW2ldLmdldEF0dHJpYnV0ZSgnaHJlZicpIH0sICcnLCB0aGlzLnRhYnNbaV0uZ2V0QXR0cmlidXRlKCdocmVmJykpO1xuICAgICAgICBpZih0aGlzLmN1cnJlbnQgPT09IG51bGwpIHsgXG4gICAgICAgICAgICB0aGlzLm9wZW4oaSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNsb3NlKHRoaXMuY3VycmVudClcbiAgICAgICAgICAgIC5vcGVuKGkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59OyIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICB0YWJDbGFzczogJy5qcy10YWItYWNjb3JkaW9uLXRhYicsXG4gICAgdGl0bGVDbGFzczogJy5qcy10YWItYWNjb3JkaW9uLXRpdGxlJyxcbiAgICBjdXJyZW50Q2xhc3M6ICdhY3RpdmUnLFxuICAgIGFjdGl2ZTogMCxcbiAgICB0YWJDdXJzb3JFdmVudDogJ2NsaWNrJ1xufTsiXX0=
