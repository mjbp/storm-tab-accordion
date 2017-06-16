const KEY_CODES = {
            SPACE: 32,
            ENTER: 13,
            TAB: 9,
            LEFT: 37,
            RIGHT: 39,
            UP:38,
            DOWN: 40
        },
        TRIGGER_EVENTS = [window.PointerEvent ? 'pointerdown' : 'ontouchstart' in window ? 'touchstart' : 'click', 'keydown' ];

export default {
    init() {
        let hash = location.hash.slice(1) || false;

        this.tabs = [].slice.call(this.DOMElement.querySelectorAll(this.settings.tabClass));
        this.titles = [].slice.call(this.DOMElement.querySelectorAll(this.settings.titleClass));
        this.targets = this.tabs.map(el => document.getElementById(el.getAttribute('href').substr(1)) || console.error('Tab target not found'));
        this.current = this.settings.active;

        if(hash !== false) this.targets.forEach((target, i) => { if (target.getAttribute('id') === hash) this.current = i; });

        this.initAria();
        this.initTitles();
        this.initTabs();
        this.open(this.current);

        return this;
    },
    initAria() {
        this.tabs.forEach((el, i) => {
            el.setAttribute('role', 'tab');
            el.setAttribute('tabIndex', 0);
            el.setAttribute('aria-expanded', false);
            el.setAttribute('aria-selected', false);
            el.setAttribute('aria-controls', el.getAttribute('href') ? el.getAttribute('href').substr(1) : el.parentNode.getAttribute('id'));
            this.targets[i].setAttribute('role', 'tabpanel');
            this.targets[i].setAttribute('aria-hidden', true);
            this.targets[i].setAttribute('tabIndex', '-1');
        });
        return this;
    },
    initTitles() {
        let handler = i => { this.toggle(i); };

        this.titles.forEach((el, i) => {
            TRIGGER_EVENTS.forEach(ev => {
                el.addEventListener(ev, e => {
                    if(e.keyCode && e.keyCode === KEY_CODES.TAB) return;

                    if(!e.keyCode || e.keyCode === KEY_CODES.ENTER || e.keyCode === KEY_CODES.SPACE){
                        e.preventDefault();
                        handler.call(this, i);
                    }
                }, false);
            });
        });

        return this;
    },
    initTabs() {
        let change = id => {
                this.toggle(id);
                window.setTimeout(() => { this.tabs[this.current].focus(); }, 16);
            },
            nextId = () => (this.current === this.tabs.length - 1 ? 0 : this.current + 1),
            previousId = () => (this.current === 0 ? this.tabs.length - 1 : this.current - 1);

        this.lastFocusedTab = 0;

        this.tabs.forEach((el, i) => {
            el.addEventListener('keydown', e => {
                switch (e.keyCode) {
                case KEY_CODES.UP:
                    e.preventDefault();
                    change.call(this, previousId());
                    break;
                case KEY_CODES.LEFT:
                    change.call(this, previousId());
                    break;
                case KEY_CODES.DOWN:
                    e.preventDefault();
                    change.call(this, nextId());
                    break;
                case KEY_CODES.RIGHT:
                    change.call(this, nextId());
                    break;
                case KEY_CODES.ENTER:
                    change.call(this, i);
                    break;
                case KEY_CODES.SPACE:
                    e.preventDefault();
                    change.call(this, i);
                    break;
                case KEY_CODES.TAB:
                    if(!this.getFocusableChildren(this.targets[i]).length) return;

                    e.preventDefault();
                    e.stopPropagation();
                    this.lastFocusedTab = this.getTabIndex(e.target);
                    this.setTargetFocus(this.lastFocusedTab);
                    change.call(this, i);
                    break;
                default:
                    break;
                }
            });

            el.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                change.call(this, i);
            }, false);
        });

        return this;
    },
    getTabIndex(link){
        for(let i = 0; i < this.tabs.length; i++) if(link === this.tabs[i]) return i;
        return null;
    },
    getFocusableChildren(node) {
        let focusableElements = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabIndex]:not([tabIndex="-1"])'];
        return [].slice.call(node.querySelectorAll(focusableElements.join(',')));
    },
    setTargetFocus(tabIndex){
        this.focusableChildren = this.getFocusableChildren(this.targets[tabIndex]);
        if(!this.focusableChildren.length) return false;
        
        window.setTimeout(function(){
            this.focusableChildren[0].focus();
            this.keyEventListener = this.keyListener.bind(this);
            document.addEventListener('keydown', this.keyEventListener);
        }.bind(this), 0);
    },
    keyListener(e){
        if (e.keyCode !== KEY_CODES.TAB) return;
        
        let focusedIndex = this.focusableChildren.indexOf(document.activeElement);
        
        if(focusedIndex < 0) {
            document.removeEventListener('keydown', this.keyEventListener);
            return;
        }
        
        if(e.shiftKey && focusedIndex === 0) {
            e.preventDefault();
            this.focusableChildren[this.focusableChildren.length - 1].focus();
        } else {
            if(!e.shiftKey && focusedIndex === this.focusableChildren.length - 1) {
                document.removeEventListener('keydown', this.keyEventListener);
                if(this.lastFocusedTab !== this.tabs.length - 1) {
                    e.preventDefault();
                    this.lastFocusedTab = this.lastFocusedTab + 1;
                    this.tabs[this.lastFocusedTab].focus();
                }
                
            }
        }
    },
    change(type, i) {
        this.tabs[i].classList[(type === 'open' ? 'add' : 'remove')](this.settings.currentClass);
        this.titles[i].classList[(type === 'open' ? 'add' : 'remove')](this.settings.currentClass);
        this.targets[i].classList[(type === 'open' ? 'add' : 'remove')](this.settings.currentClass);
        this.targets[i].setAttribute('aria-hidden', this.targets[i].getAttribute('aria-hidden') === 'true' ? 'false' : 'true' );
        this.tabs[i].setAttribute('aria-selected', this.tabs[i].getAttribute('aria-selected') === 'true' ? 'false' : 'true' );
        this.tabs[i].setAttribute('aria-expanded', this.tabs[i].getAttribute('aria-expanded') === 'true' ? 'false' : 'true' );
        (type === 'open' ? this.targets[i] : this.targets[this.current]).setAttribute('tabIndex', (type === 'open' ? '0' : '-1'));
    },
    open(i) {
        this.change('open', i);
        this.current = i;
        return this;
    },
    close(i) {
        this.change('close', i);
        return this;
    },
    toggle(i) {
        if(this.current === i) { return; }
        
        !!window.history.pushState && window.history.pushState({ URL: this.tabs[i].getAttribute('href') }, '', this.tabs[i].getAttribute('href'));

        if(this.current === null) this.open(i);
        else this.close(this.current).open(i);

        return this;
    }
};