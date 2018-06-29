(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFBLGFBQUEsUUFBQSxrQkFBQSxDQUFBOzs7Ozs7OztBQUVBLElBQU0sMEJBQTBCLENBQUMsWUFBTTtBQUN0QyxjQUFBLE9BQUEsQ0FBQSxJQUFBLENBQUEsbUJBQUE7QUFERCxDQUFnQyxDQUFoQzs7QUFJQSxJQUFHLHNCQUFILE1BQUEsRUFBaUMsT0FBQSxnQkFBQSxDQUFBLGtCQUFBLEVBQTRDLFlBQU07QUFBRSwwQkFBQSxPQUFBLENBQWdDLFVBQUEsRUFBQSxFQUFBO0FBQUEsV0FBQSxJQUFBO0FBQWhDLEdBQUE7QUFBcEQsQ0FBQTs7Ozs7Ozs7O0FDTmpDLElBQUEsWUFBQSxRQUFBLGdCQUFBLENBQUE7Ozs7QUFDQSxJQUFBLHNCQUFBLFFBQUEsMkJBQUEsQ0FBQTs7Ozs7Ozs7QUFFQSxJQUFNLE9BQU8sU0FBUCxJQUFPLENBQUEsR0FBQSxFQUFBLElBQUEsRUFBZTtBQUMzQixLQUFJLE1BQU0sR0FBQSxLQUFBLENBQUEsSUFBQSxDQUFjLFNBQUEsZ0JBQUEsQ0FBeEIsR0FBd0IsQ0FBZCxDQUFWOztBQUVBLEtBQUcsQ0FBQyxJQUFKLE1BQUEsRUFBZ0IsTUFBTSxJQUFBLEtBQUEsQ0FBTixvRUFBTSxDQUFOOztBQUVoQixRQUFPLElBQUEsR0FBQSxDQUFRLFVBQUEsRUFBQSxFQUFBO0FBQUEsU0FBUSxPQUFBLE1BQUEsQ0FBYyxPQUFBLE1BQUEsQ0FBYyxxQkFBNUIsT0FBYyxDQUFkLEVBQWlEO0FBQ3RFLGVBRHNFLEVBQUE7QUFFdEUsYUFBVSxPQUFBLE1BQUEsQ0FBQSxFQUFBLEVBQWtCLFdBQWxCLE9BQUEsRUFBNEIsR0FBNUIsT0FBQSxFQUFBLElBQUE7QUFGNEQsR0FBakQsRUFBUixJQUFRLEVBQVI7QUFBZixFQUFPLENBQVA7QUFMRCxDQUFBOztrQkFXZSxFQUFFLE1BQUYsSUFBQSxFOzs7Ozs7OztBQ2RmLElBQU0sWUFBWTtBQUNOLFdBRE0sRUFBQTtBQUVOLFdBRk0sRUFBQTtBQUdOLFNBSE0sQ0FBQTtBQUlOLFVBSk0sRUFBQTtBQUtOLFdBTE0sRUFBQTtBQU1OLFVBQU07QUFOQSxDQUFsQjtBQUFBLElBUVEsaUJBQWlCLENBQUMsa0JBQUEsTUFBQSxHQUFBLFlBQUEsR0FBRCxPQUFBLEVBUnpCLFNBUXlCLENBUnpCOztrQkFVZTtBQUFBLFVBQUEsU0FBQSxJQUFBLEdBQ0o7QUFBQSxZQUFBLFFBQUEsSUFBQTs7QUFDSCxZQUFJLE9BQU8sU0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsS0FBWCxLQUFBOztBQUVBLGFBQUEsSUFBQSxHQUFZLEdBQUEsS0FBQSxDQUFBLElBQUEsQ0FBYyxLQUFBLFVBQUEsQ0FBQSxnQkFBQSxDQUFpQyxLQUFBLFFBQUEsQ0FBM0QsUUFBMEIsQ0FBZCxDQUFaO0FBQ0EsYUFBQSxNQUFBLEdBQWMsR0FBQSxLQUFBLENBQUEsSUFBQSxDQUFjLEtBQUEsVUFBQSxDQUFBLGdCQUFBLENBQWlDLEtBQUEsUUFBQSxDQUE3RCxVQUE0QixDQUFkLENBQWQ7QUFDQSxhQUFBLE1BQUEsR0FBYyxLQUFBLElBQUEsQ0FBQSxHQUFBLENBQWMsVUFBQSxFQUFBLEVBQUE7QUFBQSxtQkFBTSxTQUFBLGNBQUEsQ0FBd0IsR0FBQSxZQUFBLENBQUEsTUFBQSxFQUFBLE1BQUEsQ0FBeEIsQ0FBd0IsQ0FBeEIsS0FBOEQsUUFBQSxLQUFBLENBQXBFLHNCQUFvRSxDQUFwRTtBQUE1QixTQUFjLENBQWQ7QUFDQSxhQUFBLE9BQUEsR0FBZSxLQUFBLFFBQUEsQ0FBZixNQUFBOztBQUVBLFlBQUcsU0FBSCxLQUFBLEVBQW1CLEtBQUEsTUFBQSxDQUFBLE9BQUEsQ0FBb0IsVUFBQSxNQUFBLEVBQUEsQ0FBQSxFQUFlO0FBQUUsZ0JBQUksT0FBQSxZQUFBLENBQUEsSUFBQSxNQUFKLElBQUEsRUFBd0MsTUFBQSxPQUFBLEdBQUEsQ0FBQTtBQUE3RSxTQUFBOztBQUVuQixhQUFBLGNBQUE7QUFDQSxhQUFBLFVBQUE7QUFDQSxhQUFBLFFBQUE7QUFDQSxhQUFBLElBQUEsQ0FBVSxLQUFWLE9BQUE7O0FBRUEsZUFBQSxJQUFBO0FBaEJPLEtBQUE7QUFBQSxvQkFBQSxTQUFBLGNBQUEsR0FrQk07QUFBQSxZQUFBLFNBQUEsSUFBQTs7QUFDYixhQUFBLElBQUEsQ0FBQSxPQUFBLENBQWtCLFVBQUEsR0FBQSxFQUFBLENBQUEsRUFBWTtBQUMxQixnQkFBQSxZQUFBLENBQUEsTUFBQSxFQUFBLEtBQUE7QUFDQSxnQkFBQSxZQUFBLENBQUEsVUFBQSxFQUFBLENBQUE7QUFDQSxnQkFBQSxZQUFBLENBQUEsZUFBQSxFQUFBLEtBQUE7QUFDQSxnQkFBQSxZQUFBLENBQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxtQkFBQSxNQUFBLENBQUEsQ0FBQSxFQUFBLFlBQUEsQ0FBQSxNQUFBLEVBQUEsVUFBQTtBQUNBLG1CQUFBLE1BQUEsQ0FBQSxDQUFBLEVBQUEsWUFBQSxDQUFBLFFBQUEsRUFBQSxRQUFBO0FBQ0EsbUJBQUEsTUFBQSxDQUFBLENBQUEsRUFBQSxZQUFBLENBQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxnQkFBRyxDQUFDLE9BQUEsTUFBQSxDQUFBLENBQUEsRUFBRCxpQkFBQSxJQUFxQyxPQUFBLE1BQUEsQ0FBQSxDQUFBLEVBQUEsaUJBQUEsQ0FBQSxZQUFBLENBQXhDLFVBQXdDLENBQXhDLEVBQW1HO0FBQ25HLG1CQUFBLE1BQUEsQ0FBQSxDQUFBLEVBQUEsaUJBQUEsQ0FBQSxZQUFBLENBQUEsVUFBQSxFQUFBLElBQUE7QUFUSixTQUFBO0FBV0EsZUFBQSxJQUFBO0FBOUJPLEtBQUE7QUFBQSxnQkFBQSxTQUFBLFVBQUEsR0FnQ0U7QUFBQSxZQUFBLFNBQUEsSUFBQTs7QUFDVCxZQUFJLFVBQVUsU0FBVixPQUFVLENBQUEsQ0FBQSxFQUFLO0FBQUUsbUJBQUEsTUFBQSxDQUFBLENBQUE7QUFBckIsU0FBQTs7QUFFQSxhQUFBLE1BQUEsQ0FBQSxPQUFBLENBQW9CLFVBQUEsRUFBQSxFQUFBLENBQUEsRUFBVztBQUMzQiwyQkFBQSxPQUFBLENBQXVCLFVBQUEsRUFBQSxFQUFNO0FBQ3pCLG1CQUFBLGdCQUFBLENBQUEsRUFBQSxFQUF3QixVQUFBLENBQUEsRUFBSztBQUN6Qix3QkFBRyxFQUFBLE9BQUEsSUFBYSxFQUFBLE9BQUEsS0FBYyxVQUE5QixHQUFBLEVBQTZDOztBQUU3Qyx3QkFBRyxDQUFDLEVBQUQsT0FBQSxJQUFjLEVBQUEsT0FBQSxLQUFjLFVBQTVCLEtBQUEsSUFBK0MsRUFBQSxPQUFBLEtBQWMsVUFBaEUsS0FBQSxFQUFnRjtBQUM1RSwwQkFBQSxjQUFBO0FBQ0EsZ0NBQUEsSUFBQSxDQUFBLE1BQUEsRUFBQSxDQUFBO0FBQ0g7QUFOTCxpQkFBQSxFQUFBLEtBQUE7QUFESixhQUFBO0FBREosU0FBQTs7QUFhQSxlQUFBLElBQUE7QUFoRE8sS0FBQTtBQUFBLGNBQUEsU0FBQSxRQUFBLEdBa0RBO0FBQUEsWUFBQSxTQUFBLElBQUE7O0FBQ1AsWUFBSSxTQUFTLFNBQVQsTUFBUyxDQUFBLEVBQUEsRUFBTTtBQUNYLG1CQUFBLE1BQUEsQ0FBQSxFQUFBO0FBQ0EsbUJBQUEsVUFBQSxDQUFrQixZQUFNO0FBQUUsdUJBQUEsSUFBQSxDQUFVLE9BQVYsT0FBQSxFQUFBLEtBQUE7QUFBMUIsYUFBQSxFQUFBLEVBQUE7QUFGUixTQUFBO0FBQUEsWUFJSSxTQUFTLFNBQVQsTUFBUyxHQUFBO0FBQUEsbUJBQU8sT0FBQSxPQUFBLEtBQWlCLE9BQUEsSUFBQSxDQUFBLE1BQUEsR0FBakIsQ0FBQSxHQUFBLENBQUEsR0FBNEMsT0FBQSxPQUFBLEdBQW5ELENBQUE7QUFKYixTQUFBO0FBQUEsWUFLSSxhQUFhLFNBQWIsVUFBYSxHQUFBO0FBQUEsbUJBQU8sT0FBQSxPQUFBLEtBQUEsQ0FBQSxHQUFxQixPQUFBLElBQUEsQ0FBQSxNQUFBLEdBQXJCLENBQUEsR0FBNEMsT0FBQSxPQUFBLEdBQW5ELENBQUE7QUFMakIsU0FBQTs7QUFPQSxhQUFBLElBQUEsQ0FBQSxPQUFBLENBQWtCLFVBQUEsRUFBQSxFQUFBLENBQUEsRUFBVztBQUN6QixlQUFBLGdCQUFBLENBQUEsU0FBQSxFQUErQixVQUFBLENBQUEsRUFBSztBQUNoQyx3QkFBUSxFQUFSLE9BQUE7QUFDQSx5QkFBSyxVQUFMLElBQUE7QUFDSSwrQkFBQSxJQUFBLENBQUEsTUFBQSxFQUFBLFlBQUE7QUFDQTtBQUNKLHlCQUFLLFVBQUwsSUFBQTtBQUNJLDBCQUFBLGNBQUE7QUFDQSwwQkFBQSxlQUFBO0FBQ0EsK0JBQUEsTUFBQSxDQUFBLENBQUEsRUFBQSxLQUFBO0FBQ0E7QUFDSix5QkFBSyxVQUFMLEtBQUE7QUFDSSwrQkFBQSxJQUFBLENBQUEsTUFBQSxFQUFBLFFBQUE7QUFDQTtBQUNKLHlCQUFLLFVBQUwsS0FBQTtBQUNJLCtCQUFBLElBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQTtBQUNBO0FBQ0oseUJBQUssVUFBTCxLQUFBO0FBQ0ksMEJBQUEsY0FBQTtBQUNBLCtCQUFBLElBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQTtBQUNBO0FBQ0o7QUFDSTtBQXBCSjtBQURKLGFBQUE7O0FBeUJBLGVBQUEsZ0JBQUEsQ0FBQSxPQUFBLEVBQTZCLFVBQUEsQ0FBQSxFQUFLO0FBQzlCLGtCQUFBLGNBQUE7QUFDQSxrQkFBQSxlQUFBO0FBQ0EsdUJBQUEsSUFBQSxDQUFBLE1BQUEsRUFBQSxDQUFBO0FBSEosYUFBQSxFQUFBLEtBQUE7QUExQkosU0FBQTs7QUFpQ0EsZUFBQSxJQUFBO0FBM0ZPLEtBQUE7QUFBQSxZQUFBLFNBQUEsTUFBQSxDQUFBLElBQUEsRUFBQSxDQUFBLEVBNkZLO0FBQ1osYUFBQSxJQUFBLENBQUEsQ0FBQSxFQUFBLFNBQUEsQ0FBd0IsU0FBQSxNQUFBLEdBQUEsS0FBQSxHQUF4QixRQUFBLEVBQTZELEtBQUEsUUFBQSxDQUE3RCxZQUFBO0FBQ0EsYUFBQSxNQUFBLENBQUEsQ0FBQSxFQUFBLFNBQUEsQ0FBMEIsU0FBQSxNQUFBLEdBQUEsS0FBQSxHQUExQixRQUFBLEVBQStELEtBQUEsUUFBQSxDQUEvRCxZQUFBO0FBQ0EsYUFBQSxNQUFBLENBQUEsQ0FBQSxFQUFBLFNBQUEsQ0FBMEIsU0FBQSxNQUFBLEdBQUEsS0FBQSxHQUExQixRQUFBLEVBQStELEtBQUEsUUFBQSxDQUEvRCxZQUFBO0FBQ0EsaUJBQUEsTUFBQSxHQUFrQixLQUFBLE1BQUEsQ0FBQSxDQUFBLEVBQUEsZUFBQSxDQUFsQixRQUFrQixDQUFsQixHQUE2RCxLQUFBLE1BQUEsQ0FBQSxDQUFBLEVBQUEsWUFBQSxDQUFBLFFBQUEsRUFBN0QsUUFBNkQsQ0FBN0Q7QUFDQSxhQUFBLElBQUEsQ0FBQSxDQUFBLEVBQUEsWUFBQSxDQUFBLGVBQUEsRUFBMkMsS0FBQSxJQUFBLENBQUEsQ0FBQSxFQUFBLFlBQUEsQ0FBQSxlQUFBLE1BQUEsTUFBQSxHQUFBLE9BQUEsR0FBM0MsTUFBQTtBQUNBLFNBQUMsU0FBQSxNQUFBLEdBQWtCLEtBQUEsSUFBQSxDQUFsQixDQUFrQixDQUFsQixHQUFpQyxLQUFBLElBQUEsQ0FBVSxLQUE1QyxPQUFrQyxDQUFsQyxFQUFBLFlBQUEsQ0FBQSxVQUFBLEVBQXFGLFNBQUEsTUFBQSxHQUFBLEdBQUEsR0FBckYsSUFBQTtBQUNBLFNBQUMsU0FBQSxNQUFBLEdBQWtCLEtBQUEsTUFBQSxDQUFsQixDQUFrQixDQUFsQixHQUFtQyxLQUFBLE1BQUEsQ0FBWSxLQUFoRCxPQUFvQyxDQUFwQyxFQUFBLFlBQUEsQ0FBQSxVQUFBLEVBQXlGLFNBQUEsTUFBQSxHQUFBLEdBQUEsR0FBekYsSUFBQTtBQXBHTyxLQUFBO0FBQUEsVUFBQSxTQUFBLElBQUEsQ0FBQSxDQUFBLEVBc0dIO0FBQ0osYUFBQSxNQUFBLENBQUEsTUFBQSxFQUFBLENBQUE7QUFDQSxhQUFBLE9BQUEsR0FBQSxDQUFBO0FBQ0EsZUFBQSxJQUFBO0FBekdPLEtBQUE7QUFBQSxXQUFBLFNBQUEsS0FBQSxDQUFBLENBQUEsRUEyR0Y7QUFDTCxhQUFBLE1BQUEsQ0FBQSxPQUFBLEVBQUEsQ0FBQTtBQUNBLGVBQUEsSUFBQTtBQTdHTyxLQUFBO0FBQUEsWUFBQSxTQUFBLE1BQUEsQ0FBQSxDQUFBLEVBK0dEO0FBQ04sWUFBRyxLQUFBLE9BQUEsS0FBSCxDQUFBLEVBQXVCO0FBQUU7QUFBUzs7QUFFbEMsU0FBQyxDQUFDLE9BQUEsT0FBQSxDQUFGLFNBQUEsSUFBOEIsT0FBQSxPQUFBLENBQUEsU0FBQSxDQUF5QixFQUFFLEtBQUssS0FBQSxJQUFBLENBQUEsQ0FBQSxFQUFBLFlBQUEsQ0FBaEMsTUFBZ0MsQ0FBUCxFQUF6QixFQUFBLEVBQUEsRUFBeUUsS0FBQSxJQUFBLENBQUEsQ0FBQSxFQUFBLFlBQUEsQ0FBdkcsTUFBdUcsQ0FBekUsQ0FBOUI7O0FBRUEsWUFBRyxLQUFBLE9BQUEsS0FBSCxJQUFBLEVBQTBCLEtBQUEsSUFBQSxDQUExQixDQUEwQixFQUExQixLQUNLLEtBQUEsS0FBQSxDQUFXLEtBQVgsT0FBQSxFQUFBLElBQUEsQ0FBQSxDQUFBOztBQUVMLGVBQUEsSUFBQTtBQUNIO0FBeEhVLEM7Ozs7Ozs7O2tCQ1ZBO0FBQ1gsY0FEVyx1QkFBQTtBQUVYLGdCQUZXLHlCQUFBO0FBR1gsa0JBSFcsUUFBQTtBQUlYLFlBQVE7QUFKRyxDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IFRhYkFjY29yZGlvbiBmcm9tICcuL2xpYnMvY29tcG9uZW50JztcblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkVGFza3MgPSBbKCkgPT4ge1xuXHRUYWJBY2NvcmRpb24uaW5pdCgnLmpzLXRhYi1hY2NvcmRpb24nKTtcbn1dO1xuICAgIFxuaWYoJ2FkZEV2ZW50TGlzdGVuZXInIGluIHdpbmRvdykgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSk7IiwiaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4vbGliL2RlZmF1bHRzJztcbmltcG9ydCBjb21wb25lbnRQcm90b3R5cGUgZnJvbSAnLi9saWIvY29tcG9uZW50LXByb3RvdHlwZSc7XG5cbmNvbnN0IGluaXQgPSAoc2VsLCBvcHRzKSA9PiB7XG5cdGxldCBlbHMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKSk7XG5cdFxuXHRpZighZWxzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCdUYWIgQWNjb3JkaW9uIGNhbm5vdCBiZSBpbml0aWFsaXNlZCwgbm8gYXVnbWVudGFibGUgZWxlbWVudHMgZm91bmQnKTtcblxuXHRyZXR1cm4gZWxzLm1hcCgoZWwpID0+IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShjb21wb25lbnRQcm90b3R5cGUpLCB7XG5cdFx0XHRET01FbGVtZW50OiBlbCxcblx0XHRcdHNldHRpbmdzOiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgZWwuZGF0YXNldCwgb3B0cylcblx0XHR9KS5pbml0KCkpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgeyBpbml0IH07IiwiY29uc3QgS0VZX0NPREVTID0ge1xuICAgICAgICAgICAgU1BBQ0U6IDMyLFxuICAgICAgICAgICAgRU5URVI6IDEzLFxuICAgICAgICAgICAgVEFCOiA5LFxuICAgICAgICAgICAgTEVGVDogMzcsXG4gICAgICAgICAgICBSSUdIVDogMzksXG4gICAgICAgICAgICBET1dOOiA0MFxuICAgICAgICB9LFxuICAgICAgICBUUklHR0VSX0VWRU5UUyA9IFsnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgPyAndG91Y2hzdGFydCcgOiAnY2xpY2snLCAna2V5ZG93bicgXTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGluaXQoKSB7XG4gICAgICAgIGxldCBoYXNoID0gbG9jYXRpb24uaGFzaC5zbGljZSgxKSB8fCBmYWxzZTtcblxuICAgICAgICB0aGlzLnRhYnMgPSBbXS5zbGljZS5jYWxsKHRoaXMuRE9NRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuc2V0dGluZ3MudGFiQ2xhc3MpKTtcbiAgICAgICAgdGhpcy50aXRsZXMgPSBbXS5zbGljZS5jYWxsKHRoaXMuRE9NRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuc2V0dGluZ3MudGl0bGVDbGFzcykpO1xuICAgICAgICB0aGlzLnBhbmVscyA9IHRoaXMudGFicy5tYXAoZWwgPT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWwuZ2V0QXR0cmlidXRlKCdocmVmJykuc3Vic3RyKDEpKSB8fCBjb25zb2xlLmVycm9yKCdUYWIgdGFyZ2V0IG5vdCBmb3VuZCcpKTtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5zZXR0aW5ncy5hY3RpdmU7XG5cbiAgICAgICAgaWYoaGFzaCAhPT0gZmFsc2UpIHRoaXMucGFuZWxzLmZvckVhY2goKHRhcmdldCwgaSkgPT4geyBpZiAodGFyZ2V0LmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gaGFzaCkgdGhpcy5jdXJyZW50ID0gaTsgfSk7XG5cbiAgICAgICAgdGhpcy5pbml0QXR0cmlidXRlcygpO1xuICAgICAgICB0aGlzLmluaXRUaXRsZXMoKTtcbiAgICAgICAgdGhpcy5pbml0VGFicygpO1xuICAgICAgICB0aGlzLm9wZW4odGhpcy5jdXJyZW50KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGluaXRBdHRyaWJ1dGVzKCkge1xuICAgICAgICB0aGlzLnRhYnMuZm9yRWFjaCgodGFiLCBpKSA9PiB7XG4gICAgICAgICAgICB0YWIuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYicpO1xuICAgICAgICAgICAgdGFiLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAwKTtcbiAgICAgICAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICB0YWIuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICAgICAgICAgICAgdGhpcy5wYW5lbHNbaV0uc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYnBhbmVsJyk7XG4gICAgICAgICAgICB0aGlzLnBhbmVsc1tpXS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICdoaWRkZW4nKTtcbiAgICAgICAgICAgIHRoaXMucGFuZWxzW2ldLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICAgICAgICAgIGlmKCF0aGlzLnBhbmVsc1tpXS5maXJzdEVsZW1lbnRDaGlsZCB8fCB0aGlzLnBhbmVsc1tpXS5maXJzdEVsZW1lbnRDaGlsZC5oYXNBdHRyaWJ1dGUoJ3RhYmluZGV4JykpIHJldHVybjtcbiAgICAgICAgICAgIHRoaXMucGFuZWxzW2ldLmZpcnN0RWxlbWVudENoaWxkLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaW5pdFRpdGxlcygpIHtcbiAgICAgICAgbGV0IGhhbmRsZXIgPSBpID0+IHsgdGhpcy50b2dnbGUoaSk7IH07XG5cbiAgICAgICAgdGhpcy50aXRsZXMuZm9yRWFjaCgoZWwsIGkpID0+IHtcbiAgICAgICAgICAgIFRSSUdHRVJfRVZFTlRTLmZvckVhY2goZXYgPT4ge1xuICAgICAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXYsIGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZihlLmtleUNvZGUgJiYgZS5rZXlDb2RlID09PSBLRVlfQ09ERVMuVEFCKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoIWUua2V5Q29kZSB8fCBlLmtleUNvZGUgPT09IEtFWV9DT0RFUy5FTlRFUiB8fCBlLmtleUNvZGUgPT09IEtFWV9DT0RFUy5TUEFDRSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgaSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBpbml0VGFicygpIHtcbiAgICAgICAgbGV0IGNoYW5nZSA9IGlkID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZShpZCk7XG4gICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnRhYnNbdGhpcy5jdXJyZW50XS5mb2N1cygpOyB9LCAxNik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmV4dElkID0gKCkgPT4gKHRoaXMuY3VycmVudCA9PT0gdGhpcy50YWJzLmxlbmd0aCAtIDEgPyAwIDogdGhpcy5jdXJyZW50ICsgMSksXG4gICAgICAgICAgICBwcmV2aW91c0lkID0gKCkgPT4gKHRoaXMuY3VycmVudCA9PT0gMCA/IHRoaXMudGFicy5sZW5ndGggLSAxIDogdGhpcy5jdXJyZW50IC0gMSk7XG5cbiAgICAgICAgdGhpcy50YWJzLmZvckVhY2goKGVsLCBpKSA9PiB7XG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZSA9PiB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5MRUZUOlxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBwcmV2aW91c0lkKCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5ET1dOOlxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFuZWxzW2ldLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLlJJR0hUOlxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBuZXh0SWQoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLkVOVEVSOlxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuU1BBQ0U6XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgaSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGNoYW5nZS5jYWxsKHRoaXMsIGkpO1xuICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGNoYW5nZSh0eXBlLCBpKSB7XG4gICAgICAgIHRoaXMudGFic1tpXS5jbGFzc0xpc3RbKHR5cGUgPT09ICdvcGVuJyA/ICdhZGQnIDogJ3JlbW92ZScpXSh0aGlzLnNldHRpbmdzLmN1cnJlbnRDbGFzcyk7XG4gICAgICAgIHRoaXMudGl0bGVzW2ldLmNsYXNzTGlzdFsodHlwZSA9PT0gJ29wZW4nID8gJ2FkZCcgOiAncmVtb3ZlJyldKHRoaXMuc2V0dGluZ3MuY3VycmVudENsYXNzKTtcbiAgICAgICAgdGhpcy5wYW5lbHNbaV0uY2xhc3NMaXN0Wyh0eXBlID09PSAnb3BlbicgPyAnYWRkJyA6ICdyZW1vdmUnKV0odGhpcy5zZXR0aW5ncy5jdXJyZW50Q2xhc3MpO1xuICAgICAgICB0eXBlID09PSAnb3BlbicgPyB0aGlzLnBhbmVsc1tpXS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpIDogdGhpcy5wYW5lbHNbaV0uc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnaGlkZGVuJyk7XG4gICAgICAgIHRoaXMudGFic1tpXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCB0aGlzLnRhYnNbaV0uZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJyA/ICdmYWxzZScgOiAndHJ1ZScgKTtcbiAgICAgICAgKHR5cGUgPT09ICdvcGVuJyA/IHRoaXMudGFic1tpXSA6IHRoaXMudGFic1t0aGlzLmN1cnJlbnRdKS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgKHR5cGUgPT09ICdvcGVuJyA/ICcwJyA6ICctMScpKTtcbiAgICAgICAgKHR5cGUgPT09ICdvcGVuJyA/IHRoaXMucGFuZWxzW2ldIDogdGhpcy5wYW5lbHNbdGhpcy5jdXJyZW50XSkuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICh0eXBlID09PSAnb3BlbicgPyAnMCcgOiAnLTEnKSk7XG4gICAgfSxcbiAgICBvcGVuKGkpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2UoJ29wZW4nLCBpKTtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gaTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjbG9zZShpKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlKCdjbG9zZScsIGkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHRvZ2dsZShpKSB7XG4gICAgICAgIGlmKHRoaXMuY3VycmVudCA9PT0gaSkgeyByZXR1cm47IH1cbiAgICAgICAgXG4gICAgICAgICEhd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlICYmIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7IFVSTDogdGhpcy50YWJzW2ldLmdldEF0dHJpYnV0ZSgnaHJlZicpIH0sICcnLCB0aGlzLnRhYnNbaV0uZ2V0QXR0cmlidXRlKCdocmVmJykpO1xuXG4gICAgICAgIGlmKHRoaXMuY3VycmVudCA9PT0gbnVsbCkgdGhpcy5vcGVuKGkpO1xuICAgICAgICBlbHNlIHRoaXMuY2xvc2UodGhpcy5jdXJyZW50KS5vcGVuKGkpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIHRhYkNsYXNzOiAnLmpzLXRhYi1hY2NvcmRpb24tdGFiJyxcbiAgICB0aXRsZUNsYXNzOiAnLmpzLXRhYi1hY2NvcmRpb24tdGl0bGUnLFxuICAgIGN1cnJlbnRDbGFzczogJ2FjdGl2ZScsXG4gICAgYWN0aXZlOiAwXG59OyJdfQ==
