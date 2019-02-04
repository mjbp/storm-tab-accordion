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
            _this2.titles[i].setAttribute('aria-selected', false);
            _this2.titles[i].setAttribute('aria-controls', _this2.panels[i].getAttribute('id'));
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
        this.titles[i].setAttribute('aria-selected', this.titles[i].getAttribute('aria-selected') === 'true' ? 'false' : 'true');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFBLGFBQUEsUUFBQSxrQkFBQSxDQUFBOzs7Ozs7OztBQUVBLElBQU0sMEJBQTBCLENBQUMsWUFBTTtBQUN0QyxjQUFBLE9BQUEsQ0FBQSxJQUFBLENBQUEsbUJBQUE7QUFERCxDQUFnQyxDQUFoQzs7QUFJQSxJQUFHLHNCQUFILE1BQUEsRUFBaUMsT0FBQSxnQkFBQSxDQUFBLGtCQUFBLEVBQTRDLFlBQU07QUFBRSwwQkFBQSxPQUFBLENBQWdDLFVBQUEsRUFBQSxFQUFBO0FBQUEsV0FBQSxJQUFBO0FBQWhDLEdBQUE7QUFBcEQsQ0FBQTs7Ozs7Ozs7O0FDTmpDLElBQUEsWUFBQSxRQUFBLGdCQUFBLENBQUE7Ozs7QUFDQSxJQUFBLHNCQUFBLFFBQUEsMkJBQUEsQ0FBQTs7Ozs7Ozs7QUFFQSxJQUFNLE9BQU8sU0FBUCxJQUFPLENBQUEsR0FBQSxFQUFBLElBQUEsRUFBZTtBQUMzQixLQUFJLE1BQU0sR0FBQSxLQUFBLENBQUEsSUFBQSxDQUFjLFNBQUEsZ0JBQUEsQ0FBeEIsR0FBd0IsQ0FBZCxDQUFWOztBQUVBLEtBQUcsQ0FBQyxJQUFKLE1BQUEsRUFBZ0IsTUFBTSxJQUFBLEtBQUEsQ0FBTixvRUFBTSxDQUFOOztBQUVoQixRQUFPLElBQUEsR0FBQSxDQUFRLFVBQUEsRUFBQSxFQUFBO0FBQUEsU0FBUSxPQUFBLE1BQUEsQ0FBYyxPQUFBLE1BQUEsQ0FBYyxxQkFBNUIsT0FBYyxDQUFkLEVBQWlEO0FBQ3RFLGVBRHNFLEVBQUE7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O0FBSVgsWUFBUTtBQUpHLEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgVGFiQWNjb3JkaW9uIGZyb20gJy4vbGlicy9jb21wb25lbnQnO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG5cdFRhYkFjY29yZGlvbi5pbml0KCcuanMtdGFiLWFjY29yZGlvbicpO1xufV07XG4gICAgXG5pZignYWRkRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93KSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHsgb25ET01Db250ZW50TG9hZGVkVGFza3MuZm9yRWFjaCgoZm4pID0+IGZuKCkpOyB9KTsiLCJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9saWIvZGVmYXVsdHMnO1xuaW1wb3J0IGNvbXBvbmVudFByb3RvdHlwZSBmcm9tICcuL2xpYi9jb21wb25lbnQtcHJvdG90eXBlJztcblxuY29uc3QgaW5pdCA9IChzZWwsIG9wdHMpID0+IHtcblx0bGV0IGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpKTtcblx0XG5cdGlmKCFlbHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ1RhYiBBY2NvcmRpb24gY2Fubm90IGJlIGluaXRpYWxpc2VkLCBubyBhdWdtZW50YWJsZSBlbGVtZW50cyBmb3VuZCcpO1xuXG5cdHJldHVybiBlbHMubWFwKChlbCkgPT4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGNvbXBvbmVudFByb3RvdHlwZSksIHtcblx0XHRcdERPTUVsZW1lbnQ6IGVsLFxuXHRcdFx0c2V0dGluZ3M6IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBlbC5kYXRhc2V0LCBvcHRzKVxuXHRcdH0pLmluaXQoKSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7IGluaXQgfTsiLCJjb25zdCBLRVlfQ09ERVMgPSB7XG4gICAgICAgICAgICBTUEFDRTogMzIsXG4gICAgICAgICAgICBFTlRFUjogMTMsXG4gICAgICAgICAgICBUQUI6IDksXG4gICAgICAgICAgICBMRUZUOiAzNyxcbiAgICAgICAgICAgIFJJR0hUOiAzOSxcbiAgICAgICAgICAgIERPV046IDQwXG4gICAgICAgIH0sXG4gICAgICAgIFRSSUdHRVJfRVZFTlRTID0gWydvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyA/ICd0b3VjaHN0YXJ0JyA6ICdjbGljaycsICdrZXlkb3duJyBdO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgaW5pdCgpIHtcbiAgICAgICAgbGV0IGhhc2ggPSBsb2NhdGlvbi5oYXNoLnNsaWNlKDEpIHx8IGZhbHNlO1xuXG4gICAgICAgIHRoaXMudGFicyA9IFtdLnNsaWNlLmNhbGwodGhpcy5ET01FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5zZXR0aW5ncy50YWJDbGFzcykpO1xuICAgICAgICB0aGlzLnRpdGxlcyA9IFtdLnNsaWNlLmNhbGwodGhpcy5ET01FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5zZXR0aW5ncy50aXRsZUNsYXNzKSk7XG4gICAgICAgIHRoaXMucGFuZWxzID0gdGhpcy50YWJzLm1hcChlbCA9PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5zdWJzdHIoMSkpIHx8IGNvbnNvbGUuZXJyb3IoJ1RhYiB0YXJnZXQgbm90IGZvdW5kJykpO1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLnNldHRpbmdzLmFjdGl2ZTtcblxuICAgICAgICBpZihoYXNoICE9PSBmYWxzZSkgdGhpcy5wYW5lbHMuZm9yRWFjaCgodGFyZ2V0LCBpKSA9PiB7IGlmICh0YXJnZXQuZ2V0QXR0cmlidXRlKCdpZCcpID09PSBoYXNoKSB0aGlzLmN1cnJlbnQgPSBpOyB9KTtcblxuICAgICAgICB0aGlzLmluaXRBdHRyaWJ1dGVzKCk7XG4gICAgICAgIHRoaXMuaW5pdFRpdGxlcygpO1xuICAgICAgICB0aGlzLmluaXRUYWJzKCk7XG4gICAgICAgIHRoaXMub3Blbih0aGlzLmN1cnJlbnQpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaW5pdEF0dHJpYnV0ZXMoKSB7XG4gICAgICAgIHRoaXMudGFicy5mb3JFYWNoKCh0YWIsIGkpID0+IHtcbiAgICAgICAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndGFiJyk7XG4gICAgICAgICAgICB0YWIuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIDApO1xuICAgICAgICAgICAgdGFiLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG4gICAgICAgICAgICB0aGlzLnBhbmVsc1tpXS5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndGFicGFuZWwnKTtcbiAgICAgICAgICAgIHRoaXMucGFuZWxzW2ldLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgJ2hpZGRlbicpO1xuICAgICAgICAgICAgdGhpcy5wYW5lbHNbaV0uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICAgICAgICAgICAgdGhpcy50aXRsZXNbaV0uc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy50aXRsZXNbaV0uc2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJywgdGhpcy5wYW5lbHNbaV0uZ2V0QXR0cmlidXRlKCdpZCcpKTtcbiAgICAgICAgICAgIGlmKCF0aGlzLnBhbmVsc1tpXS5maXJzdEVsZW1lbnRDaGlsZCB8fCB0aGlzLnBhbmVsc1tpXS5maXJzdEVsZW1lbnRDaGlsZC5oYXNBdHRyaWJ1dGUoJ3RhYmluZGV4JykpIHJldHVybjtcbiAgICAgICAgICAgIHRoaXMucGFuZWxzW2ldLmZpcnN0RWxlbWVudENoaWxkLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaW5pdFRpdGxlcygpIHtcbiAgICAgICAgbGV0IGhhbmRsZXIgPSBpID0+IHsgdGhpcy50b2dnbGUoaSk7IH07XG5cbiAgICAgICAgdGhpcy50aXRsZXMuZm9yRWFjaCgoZWwsIGkpID0+IHtcbiAgICAgICAgICAgIFRSSUdHRVJfRVZFTlRTLmZvckVhY2goZXYgPT4ge1xuICAgICAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXYsIGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZihlLmtleUNvZGUgJiYgZS5rZXlDb2RlID09PSBLRVlfQ09ERVMuVEFCKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoIWUua2V5Q29kZSB8fCBlLmtleUNvZGUgPT09IEtFWV9DT0RFUy5FTlRFUiB8fCBlLmtleUNvZGUgPT09IEtFWV9DT0RFUy5TUEFDRSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgaSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBpbml0VGFicygpIHtcbiAgICAgICAgbGV0IGNoYW5nZSA9IGlkID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZShpZCk7XG4gICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnRhYnNbdGhpcy5jdXJyZW50XS5mb2N1cygpOyB9LCAxNik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmV4dElkID0gKCkgPT4gKHRoaXMuY3VycmVudCA9PT0gdGhpcy50YWJzLmxlbmd0aCAtIDEgPyAwIDogdGhpcy5jdXJyZW50ICsgMSksXG4gICAgICAgICAgICBwcmV2aW91c0lkID0gKCkgPT4gKHRoaXMuY3VycmVudCA9PT0gMCA/IHRoaXMudGFicy5sZW5ndGggLSAxIDogdGhpcy5jdXJyZW50IC0gMSk7XG5cbiAgICAgICAgdGhpcy50YWJzLmZvckVhY2goKGVsLCBpKSA9PiB7XG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZSA9PiB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5MRUZUOlxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBwcmV2aW91c0lkKCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5ET1dOOlxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFuZWxzW2ldLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLlJJR0hUOlxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBuZXh0SWQoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLkVOVEVSOlxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuU1BBQ0U6XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgaSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGNoYW5nZS5jYWxsKHRoaXMsIGkpO1xuICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGNoYW5nZSh0eXBlLCBpKSB7XG4gICAgICAgIHRoaXMudGFic1tpXS5jbGFzc0xpc3RbKHR5cGUgPT09ICdvcGVuJyA/ICdhZGQnIDogJ3JlbW92ZScpXSh0aGlzLnNldHRpbmdzLmN1cnJlbnRDbGFzcyk7XG4gICAgICAgIHRoaXMudGl0bGVzW2ldLmNsYXNzTGlzdFsodHlwZSA9PT0gJ29wZW4nID8gJ2FkZCcgOiAncmVtb3ZlJyldKHRoaXMuc2V0dGluZ3MuY3VycmVudENsYXNzKTtcbiAgICAgICAgdGhpcy5wYW5lbHNbaV0uY2xhc3NMaXN0Wyh0eXBlID09PSAnb3BlbicgPyAnYWRkJyA6ICdyZW1vdmUnKV0odGhpcy5zZXR0aW5ncy5jdXJyZW50Q2xhc3MpO1xuICAgICAgICB0eXBlID09PSAnb3BlbicgPyB0aGlzLnBhbmVsc1tpXS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpIDogdGhpcy5wYW5lbHNbaV0uc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnaGlkZGVuJyk7XG4gICAgICAgIHRoaXMudGFic1tpXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCB0aGlzLnRhYnNbaV0uZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJyA/ICdmYWxzZScgOiAndHJ1ZScgKTtcbiAgICAgICAgdGhpcy50aXRsZXNbaV0uc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgdGhpcy50aXRsZXNbaV0uZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJyA/ICdmYWxzZScgOiAndHJ1ZScgKTtcbiAgICAgICAgKHR5cGUgPT09ICdvcGVuJyA/IHRoaXMudGFic1tpXSA6IHRoaXMudGFic1t0aGlzLmN1cnJlbnRdKS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgKHR5cGUgPT09ICdvcGVuJyA/ICcwJyA6ICctMScpKTtcbiAgICAgICAgKHR5cGUgPT09ICdvcGVuJyA/IHRoaXMucGFuZWxzW2ldIDogdGhpcy5wYW5lbHNbdGhpcy5jdXJyZW50XSkuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICh0eXBlID09PSAnb3BlbicgPyAnMCcgOiAnLTEnKSk7XG4gICAgfSxcbiAgICBvcGVuKGkpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2UoJ29wZW4nLCBpKTtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gaTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjbG9zZShpKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlKCdjbG9zZScsIGkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHRvZ2dsZShpKSB7XG4gICAgICAgIGlmKHRoaXMuY3VycmVudCA9PT0gaSkgeyByZXR1cm47IH1cbiAgICAgICAgXG4gICAgICAgICEhd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlICYmIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7IFVSTDogdGhpcy50YWJzW2ldLmdldEF0dHJpYnV0ZSgnaHJlZicpIH0sICcnLCB0aGlzLnRhYnNbaV0uZ2V0QXR0cmlidXRlKCdocmVmJykpO1xuXG4gICAgICAgIGlmKHRoaXMuY3VycmVudCA9PT0gbnVsbCkgdGhpcy5vcGVuKGkpO1xuICAgICAgICBlbHNlIHRoaXMuY2xvc2UodGhpcy5jdXJyZW50KS5vcGVuKGkpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIHRhYkNsYXNzOiAnLmpzLXRhYi1hY2NvcmRpb24tdGFiJyxcbiAgICB0aXRsZUNsYXNzOiAnLmpzLXRhYi1hY2NvcmRpb24tdGl0bGUnLFxuICAgIGN1cnJlbnRDbGFzczogJ2FjdGl2ZScsXG4gICAgYWN0aXZlOiAwXG59OyJdfQ==
