/**
 * @name storm-tab-accordion: 
 * @version 0.1.0: Sun, 10 Apr 2016 14:10:32 GMT
 * @author stormid
 * @license MIT
 */(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.StormTabAccordion = factory();
  }
}(this, function() {
	'use strict';
    
    var defaults = {
            delay: 200,
            breakpoint: 1009,
            tabClass: '.js-tab-accordion-tab',
            titleClass: '.js-tab-accordion-title',
            currentClass: 'active'
        };
    
    function TabAccordion(el, opts) {
        var ariaControls;
        
        this.settings = STORM.UTILS.merge({}, defaults, opts);
        this.tabs = [].slice.call(el.querySelectorAll(this.settings.tabClass));
        this.titles = [].slice.call(el.querySelectorAll(this.settings.titleClass));
        this.targets = this.tabs.map(function(el){
            return document.getElementById(el.getAttribute('href').substr(1));
         });
        this.current = 0;
        this.initAria();
        this.initTabs();
        this.initTitles();
    }
    
    TabAccordion.prototype.initAria = function() {
        this.tabs.forEach(function(el){
            STORM.UTILS.attributelist.add(el, {
                'role' : 'tab',
                'aria-controls' : el.getAttribute('href').substr(1)
            });
        });
        this.targets.forEach(function(el){
            STORM.UTILS.attributelist.add(el, {
                'role' : 'tabpanel',
                'aria-hidden' : true,
                tabIndex: '-1'
            });
        });
        return this;
    };
    
    //refactor tabs and title initialisation into the same function
    TabAccordion.prototype.initTabs = function() {
        this.tabs.forEach(function(el, i){
            //add touchstart eventlistener
            el.addEventListener('click', function(e){
                e.preventDefault();
                this.toggle(i);
            }.bind(this), false);
        }.bind(this));
        
        return this;
    };
    
    TabAccordion.prototype.initTitles = function() {
        var handler = function(i){
            if(i === this.current) { return false; }
            this.toggle(i);
        };
        
        this.titles.forEach(function(el, i){
            //add touchstart eventlistener
            el.addEventListener('click', function(e){
                e.preventDefault();
                handler.call(this, i);
            }.bind(this), false);
        }.bind(this));
        
        return this;
    };
    
    TabAccordion.prototype.open = function(i) {
        STORM.UTILS.classlist.add(this.targets[i], this.settings.currentClass);
        STORM.UTILS.classlist.add(this.tabs[i], this.settings.currentClass);
        STORM.UTILS.attributelist.toggle(this.targets[i], 'aria-hidden');
        STORM.UTILS.attributelist.add(this.targets[i], {
            'tabIndex': '0'
        });
        STORM.UTILS.attributelist.add(this.tabs[i], {
            'aria-selected': true
        });
        this.current = i;
        return this;
    };
    
    TabAccordion.prototype.close = function(i) {
        STORM.UTILS.classlist.remove(this.targets[this.current], this.settings.currentClass);
        STORM.UTILS.classlist.remove(this.tabs[this.current], this.settings.currentClass);
        STORM.UTILS.attributelist.toggle(this.targets[this.current], 'aria-hidden');
        STORM.UTILS.attributelist.add(this.targets[this.current], {
            'tabIndex': '-1'
        });
        STORM.UTILS.attributelist.add(this.tabs[this.current], {
            'aria-selected': null
        });
        return this;
    };
    
    TabAccordion.prototype.toggle = function(i) {
        if(this.current === i) {
            return; 
        }
        
        this.close(i)
            .open(i);
        
        return this;
    };
    
    function init(sel, opts) {
        if(!('querySelectorAll' in document)) {
            throw new Error('TabAccordion cannot be initialised');
        }
        
        var tabAccordions = [];
        
        [].slice.call(document.querySelectorAll(sel)).forEach(function(el){
            tabAccordions.push(new TabAccordion(el, opts));
        });
        return tabAccordions;
    }

	
	return {
		init: init
	};
	
 }));