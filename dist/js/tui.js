/*!
  * TUI v1.0.0 (https://github.com/tachigo/ui)
  * Copyright 2011-2018 tachigo
  */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery'), require('popper.js')) :
	typeof define === 'function' && define.amd ? define(['exports', 'jquery', 'popper.js'], factory) :
	(factory((global.tui = {}),global.jQuery,global.Popper));
}(this, (function (exports,$,Popper) { 'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;
Popper = Popper && Popper.hasOwnProperty('default') ? Popper['default'] : Popper;

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var Util = function ($$$1) {
  var transition = false;
  var MAX_UID = 1000000;
  var TRANSITION_END = 'transitionend';
  var MILLISECONDS_MULTIPLIER = 1000; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

  function toType(obj) {
    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
  }

  function getSpecialTransitionEndEvent() {
    return {
      bindType: TRANSITION_END,
      delegateType: TRANSITION_END,
      handle: function handle(event) {
        if ($$$1(event.target).is(this)) {
          return event.handleObj.handler.apply(this, arguments); // eslint-disable-line prefer-rest-params
        }

        return undefined; // eslint-disable-line no-undefined
      }
    };
  }

  function transitionEndTest() {
    if (typeof window !== 'undefined' && window.QUnit) {
      return false;
    }

    return {
      end: 'transitionend'
    };
  }

  function transitionEndEmulator(duration) {
    var _this = this;

    var called = false;
    $$$1(this).one(Util.TRANSITION_END, function () {
      called = true;
    });
    setTimeout(function () {
      if (!called) {
        Util.triggerTransitionEnd(_this);
      }
    }, duration);
    return this;
  }

  function setTransitionEndSupport() {
    transition = transitionEndTest();
    $$$1.fn.emulateTransitionEnd = transitionEndEmulator;

    if (Util.supportsTransitionEnd()) {
      $$$1.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
    }
  }

  var Util = {
    TRANSITION_END: 'tuiTransitionEnd',
    getUID: function getUID(prefix) {
      do {
        prefix += ~~(Math.random() * MAX_UID);
      } while (document.getElementById(prefix));

      return prefix;
    },
    getSelectorFromElement: function getSelectorFromElement(element) {
      var selector = element.getAttribute('data-target');

      if (!selector || selector === '#') {
        selector = element.getAttribute('href') || '';
      }

      try {
        var $selector = $$$1(document).find(selector);
        return $selector.length > 0 ? selector : null;
      } catch (err) {
        return null;
      }
    },
    getTransitionDurationFromElement: function getTransitionDurationFromElement(element) {
      if (!element) {
        return 0;
      } // Get transition-duration of the element


      var transitionDuration = $$$1(element).css('transition-duration');
      var floatTransitionDuration = parseFloat(transitionDuration); // Return 0 if element or transition duration is not found

      if (!floatTransitionDuration) {
        return 0;
      } // If multiple durations are defined, take the first


      transitionDuration = transitionDuration.split(',')[0];
      return parseFloat(transitionDuration) * MILLISECONDS_MULTIPLIER;
    },
    reflow: function reflow(element) {
      return element.offsetHeight;
    },
    triggerTransitionEnd: function triggerTransitionEnd(element) {
      $$$1(element).trigger(transition.end);
    },
    supportsTransitionEnd: function supportsTransitionEnd() {
      return Boolean(transition);
    },
    isElement: function isElement(obj) {
      return (obj[0] || obj).nodeType;
    },
    typeCheckConfig: function typeCheckConfig(componentName, config, configTypes) {
      for (var property in configTypes) {
        if (Object.prototype.hasOwnProperty.call(configTypes, property)) {
          var expectedTypes = configTypes[property];
          var value = config[property];
          var valueType = value && Util.isElement(value) ? 'element' : toType(value);

          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error(componentName.toUpperCase() + ": " + ("Option \"" + property + "\" provided type \"" + valueType + "\" ") + ("but expected type \"" + expectedTypes + "\"."));
          }
        }
      }
    }
  };
  setTransitionEndSupport();
  return Util;
}($);

var Alert = function ($$$1) {
  var NAME = 'alert';
  var VERSION = '4.0.0';
  var DATA_KEY = 'tui.alert';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
  var TRANSITION_DURATION = 150;
  var Selector = {
    DISMISS: '[data-dismiss="alert"]'
  };
  var Event = {
    CLOSE: "close" + EVENT_KEY,
    CLOSED: "closed" + EVENT_KEY,
    CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
  };
  var ClassName = {
    ALERT: 'alert',
    FADE: 'fade',
    SHOW: 'show'
  };

  var Alert =
  /*#__PURE__*/
  function () {
    function Alert(element) {
      this._element = element;
    } // Getters


    var _proto = Alert.prototype;

    // Public
    _proto.close = function close(element) {
      element = element || this._element;

      var rootElement = this._getRootElement(element);

      var customEvent = this._triggerCloseEvent(rootElement);

      if (customEvent.isDefaultPrevented()) {
        return;
      }

      this._removeElement(rootElement);
    };

    _proto.dispose = function dispose() {
      $$$1.removeData(this._element, DATA_KEY);
      this._element = null;
    }; // Private


    _proto._getRootElement = function _getRootElement(element) {
      var selector = Util.getSelectorFromElement(element);
      var parent = false;

      if (selector) {
        parent = $$$1(selector)[0];
      }

      if (!parent) {
        parent = $$$1(element).closest("." + ClassName.ALERT)[0];
      }

      return parent;
    };

    _proto._triggerCloseEvent = function _triggerCloseEvent(element) {
      var closeEvent = $$$1.Event(Event.CLOSE);
      $$$1(element).trigger(closeEvent);
      return closeEvent;
    };

    _proto._removeElement = function _removeElement(element) {
      var _this = this;

      $$$1(element).removeClass(ClassName.SHOW);

      if (!Util.supportsTransitionEnd() || !$$$1(element).hasClass(ClassName.FADE)) {
        this._destroyElement(element);

        return;
      }

      $$$1(element).one(Util.TRANSITION_END, function (event) {
        return _this._destroyElement(element, event);
      }).emulateTransitionEnd(TRANSITION_DURATION);
    };

    _proto._destroyElement = function _destroyElement(element) {
      $$$1(element).detach().trigger(Event.CLOSED).remove();
    }; // Static


    Alert._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $element = $$$1(this);
        var data = $element.data(DATA_KEY);

        if (!data) {
          data = new Alert(this);
          $element.data(DATA_KEY, data);
        }

        if (config === 'close') {
          data[config](this);
        }
      });
    };

    Alert._handleDismiss = function _handleDismiss(alertInstance) {
      return function (event) {
        if (event) {
          event.preventDefault();
        }

        alertInstance.close(this);
      };
    };

    _createClass(Alert, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }]);
    return Alert;
  }();

  $$$1(document).on(Event.CLICK_DATA_API, Selector.DISMISS, Alert._handleDismiss(new Alert()));
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $$$1.fn[NAME] = Alert._jQueryInterface;
  $$$1.fn[NAME].Constructor = Alert;

  $$$1.fn[NAME].noConflict = function () {
    $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
    return Alert._jQueryInterface;
  };

  return Alert;
}($);

var Popout = function ($$$1) {
  var NAME = 'popout';
  var VERSION = '4.0.0';
  var DATA_KEY = 'tui.popout';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
  var ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key

  var SPACE_KEYCODE = 32; // KeyboardEvent.which value for space key

  var TAB_KEYCODE = 9; // KeyboardEvent.which value for tab key

  var ARROW_UP_KEYCODE = 38; // KeyboardEvent.which value for up arrow key

  var ARROW_DOWN_KEYCODE = 40; // KeyboardEvent.which value for down arrow key

  var RIGHT_MOUSE_BUTTON_WHICH = 3; // MouseEvent.which value for the right button (assuming a right-handed mouse)

  var REGEXP_KEYDOWN = new RegExp(ARROW_UP_KEYCODE + "|" + ARROW_DOWN_KEYCODE + "|" + ESCAPE_KEYCODE);
  var Event = {
    HIDE: "hide" + EVENT_KEY,
    HIDDEN: "hidden" + EVENT_KEY,
    SHOW: "show" + EVENT_KEY,
    SHOWN: "shown" + EVENT_KEY,
    CLICK: "click" + EVENT_KEY,
    CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY,
    KEYDOWN_DATA_API: "keydown" + EVENT_KEY + DATA_API_KEY,
    KEYUP_DATA_API: "keyup" + EVENT_KEY + DATA_API_KEY
  };
  var ClassName = {
    DISABLED: 'disabled',
    SHOW: 'show',
    POPUP: 'popup',
    POPRIGHT: 'popright',
    POPLEFT: 'popleft',
    MENURIGHT: 'popout-menu-right',
    MENULEFT: 'popout-menu-left',
    POSITION_STATIC: 'position-static'
  };
  var Selector = {
    DATA_TOGGLE: '[data-toggle="popout"]',
    FORM_CHILD: '.popout form',
    MENU: '.popout-menu',
    NAVBAR_NAV: '.navbar-nav',
    VISIBLE_ITEMS: '.popout-menu .popout-item:not(.disabled):not(:disabled)'
  };
  var AttachmentMap = {
    TOP: 'top-start',
    TOPEND: 'top-end',
    BOTTOM: 'bottom-start',
    BOTTOMEND: 'bottom-end',
    RIGHT: 'right-start',
    RIGHTEND: 'right-end',
    LEFT: 'left-start',
    LEFTEND: 'left-end'
  };
  var Default = {
    offset: 0,
    flip: true,
    boundary: 'scrollParent',
    reference: 'toggle',
    display: 'dynamic'
  };
  var DefaultType = {
    offset: '(number|string|function)',
    flip: 'boolean',
    boundary: '(string|element)',
    reference: '(string|element)',
    display: 'string'
  };

  var Popout =
  /*#__PURE__*/
  function () {
    function Popout(element, config) {
      this._element = element;
      this._popper = null;
      this._config = this._getConfig(config);
      this._menu = this._getMenuElement();
      this._inNavbar = this._detectNavbar();

      this._addEventListeners();
    } // Getters


    var _proto = Popout.prototype;

    // Public
    _proto.toggle = function toggle() {
      if (this._element.disabled || $$$1(this._element).hasClass(ClassName.DISABLED)) {
        return;
      }

      var parent = Popout._getParentFromElement(this._element);

      var isActive = $$$1(this._menu).hasClass(ClassName.SHOW);

      Popout._clearMenus();

      if (isActive) {
        return;
      }

      var relatedTarget = {
        relatedTarget: this._element
      };
      var showEvent = $$$1.Event(Event.SHOW, relatedTarget);
      $$$1(parent).trigger(showEvent);

      if (showEvent.isDefaultPrevented()) {
        return;
      } // Disable totally Popper.js for Popout in Navbar


      if (!this._inNavbar) {
        /**
         * Check for Popper dependency
         * Popper - https://popper.js.org
         */
        if (typeof Popper === 'undefined') {
          throw new TypeError('TUI popout require Popper.js (https://popper.js.org)');
        }

        var referenceElement = this._element;

        if (this._config.reference === 'parent') {
          referenceElement = parent;
        } else if (Util.isElement(this._config.reference)) {
          referenceElement = this._config.reference; // Check if it's jQuery element

          if (typeof this._config.reference.jquery !== 'undefined') {
            referenceElement = this._config.reference[0];
          }
        } // If boundary is not `scrollParent`, then set position to `static`
        // to allow the menu to "escape" the scroll parent's boundaries
        // https://github.com/twbs/bootstrap/issues/24251


        if (this._config.boundary !== 'scrollParent') {
          $$$1(parent).addClass(ClassName.POSITION_STATIC);
        }

        this._popper = new Popper(referenceElement, this._menu, this._getPopperConfig());
      } // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


      if ('ontouchstart' in document.documentElement && $$$1(parent).closest(Selector.NAVBAR_NAV).length === 0) {
        $$$1(document.body).children().on('mouseover', null, $$$1.noop);
      }

      this._element.focus();

      this._element.setAttribute('aria-expanded', true);

      $$$1(this._menu).toggleClass(ClassName.SHOW);
      $$$1(parent).toggleClass(ClassName.SHOW).trigger($$$1.Event(Event.SHOWN, relatedTarget));
    };

    _proto.dispose = function dispose() {
      $$$1.removeData(this._element, DATA_KEY);
      $$$1(this._element).off(EVENT_KEY);
      this._element = null;
      this._menu = null;

      if (this._popper !== null) {
        this._popper.destroy();

        this._popper = null;
      }
    };

    _proto.update = function update() {
      this._inNavbar = this._detectNavbar();

      if (this._popper !== null) {
        this._popper.scheduleUpdate();
      }
    }; // Private


    _proto._addEventListeners = function _addEventListeners() {
      var _this = this;

      $$$1(this._element).on(Event.CLICK, function (event) {
        event.preventDefault();
        event.stopPropagation();

        _this.toggle();
      });
    };

    _proto._getConfig = function _getConfig(config) {
      config = _extends({}, this.constructor.Default, $$$1(this._element).data(), config);
      Util.typeCheckConfig(NAME, config, this.constructor.DefaultType);
      return config;
    };

    _proto._getMenuElement = function _getMenuElement() {
      if (!this._menu) {
        var parent = Popout._getParentFromElement(this._element);

        this._menu = $$$1(parent).find(Selector.MENU)[0];
      }

      return this._menu;
    };

    _proto._getPlacement = function _getPlacement() {
      var $parentPopout = $$$1(this._element).parent();
      var placement = AttachmentMap.BOTTOM; // Handle dropup

      if ($parentPopout.hasClass(ClassName.POPUP)) {
        placement = AttachmentMap.TOP;

        if ($$$1(this._menu).hasClass(ClassName.MENURIGHT)) {
          placement = AttachmentMap.TOPEND;
        }
      } else if ($parentPopout.hasClass(ClassName.POPRIGHT)) {
        placement = AttachmentMap.RIGHT;
      } else if ($parentPopout.hasClass(ClassName.POPLEFT)) {
        placement = AttachmentMap.LEFT;
      } else if ($$$1(this._menu).hasClass(ClassName.MENURIGHT)) {
        placement = AttachmentMap.BOTTOMEND;
      }

      return placement;
    };

    _proto._detectNavbar = function _detectNavbar() {
      return $$$1(this._element).closest('.navbar').length > 0;
    };

    _proto._getPopperConfig = function _getPopperConfig() {
      var _this2 = this;

      var offsetConf = {};

      if (typeof this._config.offset === 'function') {
        offsetConf.fn = function (data) {
          data.offsets = _extends({}, data.offsets, _this2._config.offset(data.offsets) || {});
          return data;
        };
      } else {
        offsetConf.offset = this._config.offset;
      }

      var popperConfig = {
        placement: this._getPlacement(),
        modifiers: {
          offset: offsetConf,
          flip: {
            enabled: this._config.flip
          },
          preventOverflow: {
            boundariesElement: this._config.boundary
          }
        }
      }; // Disable Popper.js if we have a static display

      if (this._config.display === 'static') {
        popperConfig.modifiers.applyStyle = {
          enabled: false
        };
      }

      return popperConfig;
    }; // Static


    Popout._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $$$1(this).data(DATA_KEY);

        var _config = typeof config === 'object' ? config : null;

        if (!data) {
          data = new Popout(this, _config);
          $$$1(this).data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    Popout._clearMenus = function _clearMenus(event) {
      if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH || event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
        return;
      }

      var toggles = $$$1.makeArray($$$1(Selector.DATA_TOGGLE));

      for (var i = 0; i < toggles.length; i++) {
        var parent = Popout._getParentFromElement(toggles[i]);

        var context = $$$1(toggles[i]).data(DATA_KEY);
        var relatedTarget = {
          relatedTarget: toggles[i]
        };

        if (!context) {
          continue;
        }

        var popoutMenu = context._menu;

        if (!$$$1(parent).hasClass(ClassName.SHOW)) {
          continue;
        }

        if (event && (event.type === 'click' && /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TAB_KEYCODE) && $$$1.contains(parent, event.target)) {
          continue;
        }

        var hideEvent = $$$1.Event(Event.HIDE, relatedTarget);
        $$$1(parent).trigger(hideEvent);

        if (hideEvent.isDefaultPrevented()) {
          continue;
        } // If this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support


        if ('ontouchstart' in document.documentElement) {
          $$$1(document.body).children().off('mouseover', null, $$$1.noop);
        }

        toggles[i].setAttribute('aria-expanded', 'false');
        $$$1(popoutMenu).removeClass(ClassName.SHOW);
        $$$1(parent).removeClass(ClassName.SHOW).trigger($$$1.Event(Event.HIDDEN, relatedTarget));
      }
    };

    Popout._getParentFromElement = function _getParentFromElement(element) {
      var parent;
      var selector = Util.getSelectorFromElement(element);

      if (selector) {
        parent = $$$1(selector)[0];
      }

      return parent || element.parentNode;
    }; // eslint-disable-next-line complexity


    Popout._dataApiKeydownHandler = function _dataApiKeydownHandler(event) {
      // If not input/textarea:
      //  - And not a key in REGEXP_KEYDOWN => not a popout command
      // If input/textarea:
      //  - If space key => not a popout command
      //  - If key is other than escape
      //    - If key is not up or down => not a popout command
      //    - If trigger inside the menu => not a popout command
      if (/input|textarea/i.test(event.target.tagName) ? event.which === SPACE_KEYCODE || event.which !== ESCAPE_KEYCODE && (event.which !== ARROW_DOWN_KEYCODE && event.which !== ARROW_UP_KEYCODE || $$$1(event.target).closest(Selector.MENU).length) : !REGEXP_KEYDOWN.test(event.which)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (this.disabled || $$$1(this).hasClass(ClassName.DISABLED)) {
        return;
      }

      var parent = Popout._getParentFromElement(this);

      var isActive = $$$1(parent).hasClass(ClassName.SHOW);

      if (!isActive && (event.which !== ESCAPE_KEYCODE || event.which !== SPACE_KEYCODE) || isActive && (event.which === ESCAPE_KEYCODE || event.which === SPACE_KEYCODE)) {
        if (event.which === ESCAPE_KEYCODE) {
          var toggle = $$$1(parent).find(Selector.DATA_TOGGLE)[0];
          $$$1(toggle).trigger('focus');
        }

        $$$1(this).trigger('click');
        return;
      }

      var items = $$$1(parent).find(Selector.VISIBLE_ITEMS).get();

      if (items.length === 0) {
        return;
      }

      var index = items.indexOf(event.target);

      if (event.which === ARROW_UP_KEYCODE && index > 0) {
        // Up
        index--;
      }

      if (event.which === ARROW_DOWN_KEYCODE && index < items.length - 1) {
        // Down
        index++;
      }

      if (index < 0) {
        index = 0;
      }

      items[index].focus();
    };

    _createClass(Popout, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType;
      }
    }]);
    return Popout;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $$$1(document).on(Event.KEYDOWN_DATA_API, Selector.DATA_TOGGLE, Popout._dataApiKeydownHandler).on(Event.KEYDOWN_DATA_API, Selector.MENU, Popout._dataApiKeydownHandler).on(Event.CLICK_DATA_API + " " + Event.KEYUP_DATA_API, Popout._clearMenus).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
    event.preventDefault();
    event.stopPropagation();

    Popout._jQueryInterface.call($$$1(this), 'toggle');
  }).on(Event.CLICK_DATA_API, Selector.FORM_CHILD, function (e) {
    e.stopPropagation();
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $$$1.fn[NAME] = Popout._jQueryInterface;
  $$$1.fn[NAME].Constructor = Popout;

  $$$1.fn[NAME].noConflict = function () {
    $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
    return Popout._jQueryInterface;
  };

  return Popout;
}($, Popper);

var Collapse = function ($$$1) {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  var NAME = 'collapse';
  var VERSION = '4.0.0';
  var DATA_KEY = 'tui.collapse';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
  var Default = {
    toggle: true,
    parent: ''
  };
  var DefaultType = {
    toggle: 'boolean',
    parent: '(string|element)'
  };
  var Event = {
    SHOW: "show" + EVENT_KEY,
    SHOWN: "shown" + EVENT_KEY,
    HIDE: "hide" + EVENT_KEY,
    HIDDEN: "hidden" + EVENT_KEY,
    CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
  };
  var ClassName = {
    SHOW: 'show',
    COLLAPSE: 'collapse',
    COLLAPSING: 'collapsing-',
    COLLAPSED: 'collapsed',
    ANIMATION: 'collapsing'
  };
  var Dimension = {
    WIDTH: 'width',
    HEIGHT: 'height'
  };
  var Selector = {
    ACTIVES: '.show, .collapsing-width, .collapsing-height',
    DATA_TOGGLE: '[data-toggle="collapse"]'
  };
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Collapse =
  /*#__PURE__*/
  function () {
    function Collapse(element, config) {
      this._isTransitioning = false;
      this._element = element;
      this._config = this._getConfig(config);
      this._triggerArray = $$$1.makeArray($$$1("[data-toggle=\"collapse\"][href=\"#" + element.id + "\"]," + ("[data-toggle=\"collapse\"][data-target=\"#" + element.id + "\"]")));
      var tabToggles = $$$1(Selector.DATA_TOGGLE);

      for (var i = 0; i < tabToggles.length; i++) {
        var elem = tabToggles[i];
        var selector = Util.getSelectorFromElement(elem);

        if (selector !== null && $$$1(selector).filter(element).length > 0) {
          this._selector = selector;

          this._triggerArray.push(elem);
        }
      }

      this._parent = this._config.parent ? this._getParent() : null;

      if (!this._config.parent) {
        this._addAriaAndCollapsedClass(this._element, this._triggerArray);
      }

      this._animation = $$$1(this._element).hasClass(ClassName.ANIMATION);

      if (this._config.toggle) {
        this.toggle();
      }
    } // Getters


    var _proto = Collapse.prototype;

    // Public
    _proto.toggle = function toggle() {
      if ($$$1(this._element).hasClass(ClassName.SHOW)) {
        this.hide();
      } else {
        this.show();
      }
    };

    _proto.show = function show() {
      var _this = this;

      if (this._isTransitioning || $$$1(this._element).hasClass(ClassName.SHOW)) {
        return;
      }

      var actives;
      var activesData;

      if (this._parent) {
        actives = $$$1.makeArray($$$1(this._parent).find(Selector.ACTIVES).filter("[data-parent=\"" + this._config.parent + "\"]"));

        if (actives.length === 0) {
          actives = null;
        }
      }

      if (actives) {
        activesData = $$$1(actives).not(this._selector).data(DATA_KEY);

        if (activesData && activesData._isTransitioning) {
          return;
        }
      }

      var startEvent = $$$1.Event(Event.SHOW);
      $$$1(this._element).trigger(startEvent);

      if (startEvent.isDefaultPrevented()) {
        return;
      }

      if (actives) {
        Collapse._jQueryInterface.call($$$1(actives).not(this._selector), 'hide');

        if (!activesData) {
          $$$1(actives).data(DATA_KEY, null);
        }
      }

      var dimension = this._getDimension();

      $$$1(this._element).removeClass(ClassName.COLLAPSE); // .addClass(ClassName.COLLAPSING + dimension);

      if (this._animation) {
        $$$1(this._element).addClass(ClassName.COLLAPSING + dimension);
      }

      this._element.style[dimension] = 0;

      if (this._triggerArray.length > 0) {
        $$$1(this._triggerArray).removeClass(ClassName.COLLAPSED).attr('aria-expanded', true);
      }

      this.setTransitioning(true);

      var complete = function complete() {
        if (_this._animation) {
          $$$1(_this._element).removeClass(ClassName.COLLAPSING + dimension);
        }

        $$$1(_this._element) // .removeClass(ClassName.COLLAPSING + dimension)
        .addClass(ClassName.COLLAPSE).addClass(ClassName.SHOW);
        _this._element.style[dimension] = '';

        _this.setTransitioning(false);

        $$$1(_this._element).trigger(Event.SHOWN);
      };

      var capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
      var scrollSize = "scroll" + capitalizedDimension;
      var transitionDuration = Util.getTransitionDurationFromElement(this._element);

      if (this._animation) {
        $$$1(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
        this._element.style[dimension] = this._element[scrollSize] + "px";
      } else {
        complete();
        this._element.style[dimension] = this._element[scrollSize] + "px";
      }
    };

    _proto.hide = function hide() {
      var _this2 = this;

      if (this._isTransitioning || !$$$1(this._element).hasClass(ClassName.SHOW)) {
        return;
      }

      var startEvent = $$$1.Event(Event.HIDE);
      $$$1(this._element).trigger(startEvent);

      if (startEvent.isDefaultPrevented()) {
        return;
      }

      var dimension = this._getDimension();

      this._element.style[dimension] = this._element.getBoundingClientRect()[dimension] + "px";
      Util.reflow(this._element);
      $$$1(this._element).addClass(ClassName.COLLAPSING + dimension).removeClass(ClassName.COLLAPSE).removeClass(ClassName.SHOW);

      if (this._triggerArray.length > 0) {
        for (var i = 0; i < this._triggerArray.length; i++) {
          var trigger = this._triggerArray[i];
          var selector = Util.getSelectorFromElement(trigger);

          if (selector !== null) {
            var $elem = $$$1(selector);

            if (!$elem.hasClass(ClassName.SHOW)) {
              $$$1(trigger).addClass(ClassName.COLLAPSED).attr('aria-expanded', false);
            }
          }
        }
      }

      this.setTransitioning(true);

      var complete = function complete() {
        _this2.setTransitioning(false);

        $$$1(_this2._element).removeClass(ClassName.COLLAPSING + dimension).addClass(ClassName.COLLAPSE).trigger(Event.HIDDEN);
      };

      this._element.style[dimension] = '';
      var transitionDuration = Util.getTransitionDurationFromElement(this._element);

      if (this._animation) {
        $$$1(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    };

    _proto.setTransitioning = function setTransitioning(isTransitioning) {
      this._isTransitioning = isTransitioning;
    };

    _proto.dispose = function dispose() {
      $$$1.removeData(this._element, DATA_KEY);
      this._config = null;
      this._parent = null;
      this._element = null;
      this._triggerArray = null;
      this._isTransitioning = null;
      this._animation = null;
    }; // Private


    _proto._getConfig = function _getConfig(config) {
      config = _extends({}, Default, config);
      config.toggle = Boolean(config.toggle); // Coerce string values

      Util.typeCheckConfig(NAME, config, DefaultType);
      return config;
    };

    _proto._getDimension = function _getDimension() {
      var hasWidth = $$$1(this._element).hasClass('collapse-' + Dimension.WIDTH);
      return hasWidth ? Dimension.WIDTH : Dimension.HEIGHT;
    };

    _proto._getParent = function _getParent() {
      var _this3 = this;

      var parent = null;

      if (Util.isElement(this._config.parent)) {
        parent = this._config.parent; // It's a jQuery object

        if (typeof this._config.parent.jquery !== 'undefined') {
          parent = this._config.parent[0];
        }
      } else {
        parent = $$$1(this._config.parent)[0];
      }

      var selector = "[data-toggle=\"collapse\"][data-parent=\"" + this._config.parent + "\"]";
      $$$1(parent).find(selector).each(function (i, element) {
        _this3._addAriaAndCollapsedClass(Collapse._getTargetFromElement(element), [element]);
      });
      return parent;
    };

    _proto._addAriaAndCollapsedClass = function _addAriaAndCollapsedClass(element, triggerArray) {
      if (element) {
        var isOpen = $$$1(element).hasClass(ClassName.SHOW);

        if (triggerArray.length > 0) {
          $$$1(triggerArray).toggleClass(ClassName.COLLAPSED, !isOpen).attr('aria-expanded', isOpen);
        }
      }
    }; // Static


    Collapse._getTargetFromElement = function _getTargetFromElement(element) {
      var selector = Util.getSelectorFromElement(element);
      return selector ? $$$1(selector)[0] : null;
    };

    Collapse._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $this = $$$1(this);
        var data = $this.data(DATA_KEY);

        var _config = _extends({}, Default, $this.data(), typeof config === 'object' && config);

        if (!data && _config.toggle && /show|hide/.test(config)) {
          _config.toggle = false;
        }

        if (!data) {
          data = new Collapse(this, _config);
          $this.data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(Collapse, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default;
      }
    }]);
    return Collapse;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $$$1(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
    if (event.currentTarget.tagName === 'A') {
      event.preventDefault();
    }

    var $trigger = $$$1(this);
    var selector = Util.getSelectorFromElement(this);
    $$$1(selector).each(function () {
      var $target = $$$1(this);
      var data = $target.data(DATA_KEY);
      var config = data ? 'toggle' : $trigger.data();

      Collapse._jQueryInterface.call($target, config);
    });
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $$$1.fn[NAME] = Collapse._jQueryInterface;
  $$$1.fn[NAME].Constructor = Collapse;

  $$$1.fn[NAME].noConflict = function () {
    $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
    return Collapse._jQueryInterface;
  };

  return Collapse;
}($);

var Carousel = function ($$$1) {
  var NAME = 'carousel';
  var VERSION = '4.0.0';
  var DATA_KEY = 'tui.carousel';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
  var ARROW_LEFT_KEYCODE = 37; // KeyboardEvent.which value for left arrow key

  var ARROW_RIGHT_KEYCODE = 39; // KeyboardEvent.which value for right arrow key

  var TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

  var Default = {
    interval: 5000,
    keyboard: true,
    slide: false,
    pause: 'hover',
    wrap: true
  };
  var DefaultType = {
    interval: '(number|boolean)',
    keyboard: 'boolean',
    slide: '(boolean|string)',
    pause: '(string|boolean)',
    wrap: 'boolean'
  };
  var Direction = {
    NEXT: 'next',
    PREV: 'prev',
    LEFT: 'left',
    RIGHT: 'right'
  };
  var Event = {
    SLIDE: "slide" + EVENT_KEY,
    SLID: "slid" + EVENT_KEY,
    KEYDOWN: "keydown" + EVENT_KEY,
    MOUSEENTER: "mouseenter" + EVENT_KEY,
    MOUSELEAVE: "mouseleave" + EVENT_KEY,
    TOUCHEND: "touchend" + EVENT_KEY,
    LOAD_DATA_API: "load" + EVENT_KEY + DATA_API_KEY,
    CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
  };
  var ClassName = {
    CAROUSEL: 'carousel',
    ACTIVE: 'active',
    SLIDE: 'slide',
    RIGHT: 'carousel-item-right',
    LEFT: 'carousel-item-left',
    NEXT: 'carousel-item-next',
    PREV: 'carousel-item-prev',
    ITEM: 'carousel-item'
  };
  var Selector = {
    ACTIVE: '.active',
    ACTIVE_ITEM: '.active.carousel-item',
    ITEM: '.carousel-item',
    NEXT_PREV: '.carousel-item-next, .carousel-item-prev',
    INDICATORS: '.carousel-indicators',
    DATA_SLIDE: '[data-slide], [data-slide-to]',
    DATA_RIDE: '[data-ride="carousel"]'
  };
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Carousel =
  /*#__PURE__*/
  function () {
    function Carousel(element, config) {
      this._items = null;
      this._interval = null;
      this._activeElement = null;
      this._isPaused = false;
      this._isSliding = false;
      this.touchTimeout = null;
      this._config = this._getConfig(config);
      this._element = $$$1(element)[0];
      this._indicatorsElement = $$$1(this._element).find(Selector.INDICATORS)[0];

      this._addEventListeners();
    } // Getters


    var _proto = Carousel.prototype;

    // Public
    _proto.next = function next() {
      if (!this._isSliding) {
        this._slide(Direction.NEXT);
      }
    };

    _proto.nextWhenVisible = function nextWhenVisible() {
      // Don't call next when the page isn't visible
      // or the carousel or its parent isn't visible
      if (!document.hidden && $$$1(this._element).is(':visible') && $$$1(this._element).css('visibility') !== 'hidden') {
        this.next();
      }
    };

    _proto.prev = function prev() {
      if (!this._isSliding) {
        this._slide(Direction.PREV);
      }
    };

    _proto.pause = function pause(event) {
      if (!event) {
        this._isPaused = true;
      }

      if ($$$1(this._element).find(Selector.NEXT_PREV)[0]) {
        Util.triggerTransitionEnd(this._element);
        this.cycle(true);
      }

      clearInterval(this._interval);
      this._interval = null;
    };

    _proto.cycle = function cycle(event) {
      if (!event) {
        this._isPaused = false;
      }

      if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
      }

      if (this._config.interval && !this._isPaused) {
        this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
      }
    };

    _proto.to = function to(index) {
      var _this = this;

      this._activeElement = $$$1(this._element).find(Selector.ACTIVE_ITEM)[0];

      var activeIndex = this._getItemIndex(this._activeElement);

      if (index > this._items.length - 1 || index < 0) {
        return;
      }

      if (this._isSliding) {
        $$$1(this._element).one(Event.SLID, function () {
          return _this.to(index);
        });
        return;
      }

      if (activeIndex === index) {
        this.pause();
        this.cycle();
        return;
      }

      var direction = index > activeIndex ? Direction.NEXT : Direction.PREV;

      this._slide(direction, this._items[index]);
    };

    _proto.dispose = function dispose() {
      $$$1(this._element).off(EVENT_KEY);
      $$$1.removeData(this._element, DATA_KEY);
      this._items = null;
      this._config = null;
      this._element = null;
      this._interval = null;
      this._isPaused = null;
      this._isSliding = null;
      this._activeElement = null;
      this._indicatorsElement = null;
    }; // Private


    _proto._getConfig = function _getConfig(config) {
      config = _extends({}, Default, config);
      Util.typeCheckConfig(NAME, config, DefaultType);
      return config;
    };

    _proto._addEventListeners = function _addEventListeners() {
      var _this2 = this;

      if (this._config.keyboard) {
        $$$1(this._element).on(Event.KEYDOWN, function (event) {
          return _this2._keydown(event);
        });
      }

      if (this._config.pause === 'hover') {
        $$$1(this._element).on(Event.MOUSEENTER, function (event) {
          return _this2.pause(event);
        }).on(Event.MOUSELEAVE, function (event) {
          return _this2.cycle(event);
        });

        if ('ontouchstart' in document.documentElement) {
          // If it's a touch-enabled device, mouseenter/leave are fired as
          // part of the mouse compatibility events on first tap - the carousel
          // would stop cycling until user tapped out of it;
          // here, we listen for touchend, explicitly pause the carousel
          // (as if it's the second time we tap on it, mouseenter compat event
          // is NOT fired) and after a timeout (to allow for mouse compatibility
          // events to fire) we explicitly restart cycling
          $$$1(this._element).on(Event.TOUCHEND, function () {
            _this2.pause();

            if (_this2.touchTimeout) {
              clearTimeout(_this2.touchTimeout);
            }

            _this2.touchTimeout = setTimeout(function (event) {
              return _this2.cycle(event);
            }, TOUCHEVENT_COMPAT_WAIT + _this2._config.interval);
          });
        }
      }
    };

    _proto._keydown = function _keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) {
        return;
      }

      switch (event.which) {
        case ARROW_LEFT_KEYCODE:
          event.preventDefault();
          this.prev();
          break;

        case ARROW_RIGHT_KEYCODE:
          event.preventDefault();
          this.next();
          break;

        default:
      }
    };

    _proto._getItemIndex = function _getItemIndex(element) {
      this._items = $$$1.makeArray($$$1(element).parent().find(Selector.ITEM));
      return this._items.indexOf(element);
    };

    _proto._getItemByDirection = function _getItemByDirection(direction, activeElement) {
      var isNextDirection = direction === Direction.NEXT;
      var isPrevDirection = direction === Direction.PREV;

      var activeIndex = this._getItemIndex(activeElement);

      var lastItemIndex = this._items.length - 1;
      var isGoingToWrap = isPrevDirection && activeIndex === 0 || isNextDirection && activeIndex === lastItemIndex;

      if (isGoingToWrap && !this._config.wrap) {
        return activeElement;
      }

      var delta = direction === Direction.PREV ? -1 : 1;
      var itemIndex = (activeIndex + delta) % this._items.length;
      return itemIndex === -1 ? this._items[this._items.length - 1] : this._items[itemIndex];
    };

    _proto._triggerSlideEvent = function _triggerSlideEvent(relatedTarget, eventDirectionName) {
      var targetIndex = this._getItemIndex(relatedTarget);

      var fromIndex = this._getItemIndex($$$1(this._element).find(Selector.ACTIVE_ITEM)[0]);

      var slideEvent = $$$1.Event(Event.SLIDE, {
        relatedTarget: relatedTarget,
        direction: eventDirectionName,
        from: fromIndex,
        to: targetIndex
      });
      $$$1(this._element).trigger(slideEvent);
      return slideEvent;
    };

    _proto._setActiveIndicatorElement = function _setActiveIndicatorElement(element) {
      if (this._indicatorsElement) {
        $$$1(this._indicatorsElement).find(Selector.ACTIVE).removeClass(ClassName.ACTIVE);

        var nextIndicator = this._indicatorsElement.children[this._getItemIndex(element)];

        if (nextIndicator) {
          $$$1(nextIndicator).addClass(ClassName.ACTIVE);
        }
      }
    };

    _proto._slide = function _slide(direction, element) {
      var _this3 = this;

      var activeElement = $$$1(this._element).find(Selector.ACTIVE_ITEM)[0];

      var activeElementIndex = this._getItemIndex(activeElement);

      var nextElement = element || activeElement && this._getItemByDirection(direction, activeElement);

      var nextElementIndex = this._getItemIndex(nextElement);

      var isCycling = Boolean(this._interval);
      var directionalClassName;
      var orderClassName;
      var eventDirectionName;

      if (direction === Direction.NEXT) {
        directionalClassName = ClassName.LEFT;
        orderClassName = ClassName.NEXT;
        eventDirectionName = Direction.LEFT;
      } else {
        directionalClassName = ClassName.RIGHT;
        orderClassName = ClassName.PREV;
        eventDirectionName = Direction.RIGHT;
      }

      if (nextElement && $$$1(nextElement).hasClass(ClassName.ACTIVE)) {
        this._isSliding = false;
        return;
      }

      var slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);

      if (slideEvent.isDefaultPrevented()) {
        return;
      }

      if (!activeElement || !nextElement) {
        // Some weirdness is happening, so we bail
        return;
      }

      this._isSliding = true;

      if (isCycling) {
        this.pause();
      }

      this._setActiveIndicatorElement(nextElement);

      var slidEvent = $$$1.Event(Event.SLID, {
        relatedTarget: nextElement,
        direction: eventDirectionName,
        from: activeElementIndex,
        to: nextElementIndex
      });

      if ($$$1(this._element).hasClass(ClassName.SLIDE)) {
        $$$1(nextElement).addClass(orderClassName);
        Util.reflow(nextElement);
        $$$1(activeElement).addClass(directionalClassName);
        $$$1(nextElement).addClass(directionalClassName);
        var transitionDuration = Util.getTransitionDurationFromElement(activeElement);
        $$$1(activeElement).one(Util.TRANSITION_END, function () {
          $$$1(nextElement).removeClass(directionalClassName + " " + orderClassName).addClass(ClassName.ACTIVE);
          $$$1(activeElement).removeClass(ClassName.ACTIVE + " " + orderClassName + " " + directionalClassName);
          _this3._isSliding = false;
          setTimeout(function () {
            return $$$1(_this3._element).trigger(slidEvent);
          }, 0);
        }).emulateTransitionEnd(transitionDuration);
      } else {
        $$$1(activeElement).removeClass(ClassName.ACTIVE);
        $$$1(nextElement).addClass(ClassName.ACTIVE);
        this._isSliding = false;
        $$$1(this._element).trigger(slidEvent);
      }

      if (isCycling) {
        this.cycle();
      }
    }; // Static


    Carousel._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $$$1(this).data(DATA_KEY);

        var _config = _extends({}, Default, $$$1(this).data());

        if (typeof config === 'object') {
          _config = _extends({}, _config, config);
        }

        var action = typeof config === 'string' ? config : _config.slide;

        if (!data) {
          data = new Carousel(this, _config);
          $$$1(this).data(DATA_KEY, data);
        }

        if (typeof config === 'number') {
          data.to(config);
        } else if (typeof action === 'string') {
          if (typeof data[action] === 'undefined') {
            throw new TypeError("No method named \"" + action + "\"");
          }

          data[action]();
        } else if (_config.interval) {
          data.pause();
          data.cycle();
        }
      });
    };

    Carousel._dataApiClickHandler = function _dataApiClickHandler(event) {
      var selector = Util.getSelectorFromElement(this);

      if (!selector) {
        return;
      }

      var target = $$$1(selector)[0];

      if (!target || !$$$1(target).hasClass(ClassName.CAROUSEL)) {
        return;
      }

      var config = _extends({}, $$$1(target).data(), $$$1(this).data());
      var slideIndex = this.getAttribute('data-slide-to');

      if (slideIndex) {
        config.interval = false;
      }

      Carousel._jQueryInterface.call($$$1(target), config);

      if (slideIndex) {
        $$$1(target).data(DATA_KEY).to(slideIndex);
      }

      event.preventDefault();
    };

    _createClass(Carousel, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default;
      }
    }]);
    return Carousel;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $$$1(document).on(Event.CLICK_DATA_API, Selector.DATA_SLIDE, Carousel._dataApiClickHandler);
  $$$1(window).on(Event.LOAD_DATA_API, function () {
    $$$1(Selector.DATA_RIDE).each(function () {
      var $carousel = $$$1(this);

      Carousel._jQueryInterface.call($carousel, $carousel.data());
    });
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $$$1.fn[NAME] = Carousel._jQueryInterface;
  $$$1.fn[NAME].Constructor = Carousel;

  $$$1.fn[NAME].noConflict = function () {
    $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
    return Carousel._jQueryInterface;
  };

  return Carousel;
}($);

var Layer = function ($$$1) {
  var NAME = 'layer';
  var VERSION = '4.0.0';
  var DATA_KEY = 'tui.layer';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
  var ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key

  var LAYER_ZINDEX = 1050;
  var LAYER_COUNT = 0;
  var Default = {
    offset: 'auto',
    backdrop: true,
    keyboard: true,
    focus: true,
    show: true,
    width: '',
    height: '',
    type: 'modal',
    url: '',
    fixed: true
  };
  var DefaultType = {
    offset: '(number|string|function)',
    backdrop: '(boolean|string)',
    keyboard: 'boolean',
    focus: 'boolean',
    show: 'boolean',
    width: '(number|string)',
    height: '(number|string)',
    type: 'string',
    url: 'string',
    fixed: 'boolean'
  };
  var Type = {
    modal: 'modal',
    iframe: 'iframe'
  };
  var Event = {
    HIDE: "hide" + EVENT_KEY,
    HIDDEN: "hidden" + EVENT_KEY,
    SHOW: "show" + EVENT_KEY,
    SHOWN: "shown" + EVENT_KEY,
    LOADED: "loaded" + EVENT_KEY,
    FOCUSIN: "focusin" + EVENT_KEY,
    RESIZE: "resize" + EVENT_KEY,
    CLICK_DISMISS: "click.dismiss" + EVENT_KEY,
    KEYDOWN_DISMISS: "keydown.dismiss" + EVENT_KEY,
    MOUSEUP_DISMISS: "mouseup.dismiss" + EVENT_KEY,
    MOUSEDOWN_DISMISS: "mousedown.dismiss" + EVENT_KEY,
    CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
  };
  var ClassName = {
    SCROLLBAR_MEASURER: 'layer-scrollbar-measure',
    BACKDROP: 'layer-backdrop',
    OPEN: 'layer-open',
    FADE: 'fade',
    SHOW: 'show',
    LAYER: 'layer-inner'
  };
  var Selector = {
    LAYER: '.layer-inner',
    DATA_TOGGLE: '[data-toggle="layer"]',
    DATA_DISMISS: '[data-dismiss="layer"]',
    FIXED_CONTENT: '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',
    STICKY_CONTENT: '.sticky-top',
    NAVBAR_TOGGLER: '.navbar-toggler'
  };

  var Layer =
  /*#__PURE__*/
  function () {
    function Layer(element, config) {
      this._id = ++LAYER_COUNT;
      this._config = this._getConfig(config);
      this._element = element;
      this._layer = $$$1(element).find(Selector.LAYER)[0];
      this._backdrop = null;
      this._isShown = false;
      this._isBodyOverflowing = false;
      this._scrollbarWidth = 0;
    } // Getters


    var _proto = Layer.prototype;

    // Public
    _proto.toggle = function toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    };

    _proto.show = function show(relatedTarget) {
      var _this = this;

      if (this._isTransitioning || this._isShown) {
        return;
      }

      if (this._config.url.length > 0) {
        if (!this._layer) {
          if (this._config.type === Type.iframe) {
            this._layer = document.createElement('iframe');

            this._layer.setAttribute('frameborder', '0');

            this._layer.setAttribute('scrolling', 'auto');

            this._layer.setAttribute('allowtransparency', 'true');
          } else {
            this._layer = document.createElement('div');
          }

          this._layer.className = ClassName.LAYER;
        }

        var loadFunction = function loadFunction() {
          var loadedEvent = $$$1.Event(Event.LOADED, {
            relatedTarget: relatedTarget
          });
          $$$1(this._element).trigger(loadedEvent);
        };

        if (this._config.type === Type.iframe) {
          this._layer.src = this._config.url;

          if (this._layer.attachEvent) {
            this._layer.attachEvent('onload', loadFunction);
          } else {
            this._layer.onload = loadFunction;
          }

          $$$1(this._layer).appendTo(this._element);
        } else {
          $$$1(this._layer).appendTo(this._element);
          $$$1(this._layer).load(this._config.url, $$$1.proxy(loadFunction, this));
        }
      } else {
        if (!this._layer) {
          this._layer = document.createElement('div');
          this._layer.className = ClassName.LAYER;
          $$$1(this._layer).appendTo(this._element);
        }
      }

      if ($$$1(this._element).hasClass(ClassName.FADE)) {
        this._isTransitioning = true;
      }

      var showEvent = $$$1.Event(Event.SHOW, {
        relatedTarget: relatedTarget
      });
      $$$1(this._element).trigger(showEvent);

      if (this._isShown || showEvent.isDefaultPrevented()) {
        return;
      }

      this._isShown = true;

      this._checkScrollbar();

      this._setScrollbar();

      $$$1(this._element).addClass(ClassName.SHOW).css({
        'z-index': LAYER_ZINDEX + LAYER_COUNT
      });

      if (this._config.width) {
        $$$1(this._element).css({
          'width': this._config.width
        });
        $$$1(this._layer).css({
          'width': this._config.width
        });
      }

      if (this._config.height) {
        $$$1(this._element).css({
          'height': this._config.height
        });
        $$$1(this._layer).css({
          'height': this._config.height
        });
      }

      if (this._config.fixed) {
        $$$1(document.body).addClass(ClassName.OPEN);
      }

      this._setEscapeEvent();

      this._setResizeEvent();

      $$$1(this._element).on(Event.CLICK_DISMISS, Selector.DATA_DISMISS, function (event) {
        return _this.hide(event);
      });

      this._showBackdrop(function () {
        return _this._showElement(relatedTarget);
      });
    };

    _proto.hide = function hide(event) {
      var _this2 = this;

      if (event) {
        event.preventDefault();
      }

      if (this._isTransitioning || !this._isShown) {
        return;
      }

      var hideEvent = $$$1.Event(Event.HIDE);
      $$$1(this._element).trigger(hideEvent);

      if (!this._isShown || hideEvent.isDefaultPrevented()) {
        return;
      }

      this._isShown = false;
      var transition = $$$1(this._element).hasClass(ClassName.FADE);

      if (transition) {
        this._isTransitioning = true;
      }

      this._setEscapeEvent();

      this._setResizeEvent();

      $$$1(document).off(Event.FOCUSIN);
      $$$1(this._element).removeClass(ClassName.SHOW);
      $$$1(this._element).off(Event.CLICK_DISMISS);
      $$$1(this._layer).off(Event.MOUSEDOWN_DISMISS);

      if (transition) {
        var transitionDuration = Util.getTransitionDurationFromElement(this._element);
        $$$1(this._element).one(Util.TRANSITION_END, function (event) {
          return _this2._hideLayer(event);
        }).emulateTransitionEnd(transitionDuration);
      } else {
        this._hideLayer();
      }
    };

    _proto.dispose = function dispose() {
      $$$1.removeData(this._element, DATA_KEY);
      $$$1(window, document, this._element, this._backdrop).off(EVENT_KEY);
      this._config = null;
      this._layer = null;
      this._element = null;
      this._backdrop = null;
      this._isShown = null;
      this._isBodyOverflowing = null;
      this._scrollbarWidth = null;
    };

    _proto.update = function update() {
      this._adjustLayer();
    }; // Private


    _proto._getConfig = function _getConfig(config) {
      config = _extends({}, Default, config);
      Util.typeCheckConfig(NAME, config, DefaultType);
      return config;
    };

    _proto._getPlacement = function _getPlacement() {
      var $window = $$$1(window);
      var $element = $$$1(this._element);
      var outerHeight = $element.outerHeight();
      var outerWidth = $element.outerWidth();
      var offsetTop = ($window.height() - outerHeight) / 2;
      var offsetLeft = ($window.width() - outerWidth) / 2;

      if (this._config.offset !== 'auto') {
        if (this._config.offset === 't') {
          //上
          offsetTop = 0;
        } else if (this._config.offset === 'r') {
          //右
          offsetLeft = $window.width() - outerWidth;
        } else if (this._config.offset === 'b') {
          //下
          offsetTop = $window.height() - outerHeight;
        } else if (this._config.offset === 'l') {
          //左
          offsetLeft = 0;
        } else if (this._config.offset === 'lt') {
          //左上角
          offsetTop = 0;
          offsetLeft = 0;
        } else if (this._config.offset === 'lb') {
          //左下角
          offsetTop = $window.height() - outerHeight;
          offsetLeft = 0;
        } else if (this._config.offset === 'rt') {
          //右上角
          offsetTop = 0;
          offsetLeft = $window.width() - outerWidth;
        } else if (this._config.offset === 'rb') {
          //右下角
          offsetTop = $window.height() - outerHeight;
          offsetLeft = $window.width() - outerWidth;
        } else {
          offsetTop = this._config.offset;
        }
      } else {
        offsetTop = 40;
      }

      offsetTop = Math.max(40, offsetTop);
      $element.css({
        top: offsetTop,
        left: offsetLeft
      });
    };

    _proto._showElement = function _showElement(relatedTarget) {
      var _this3 = this;

      var transition = $$$1(this._element).hasClass(ClassName.FADE);

      if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
        // Don't move modal's DOM position
        document.body.appendChild(this._element);
      }

      this._element.style.display = 'block';

      this._element.removeAttribute('aria-hidden');

      this._element.scrollTop = 0;

      this._element.setAttribute('data-id', 'layer-' + this._id);

      if (transition) {
        Util.reflow(this._element);
      }

      if (this._config.focus) {
        this._enforceFocus();
      }

      var shownEvent = $$$1.Event(Event.SHOWN, {
        relatedTarget: relatedTarget
      });

      var transitionComplete = function transitionComplete() {
        if (_this3._config.focus) {
          _this3._element.focus();
        }

        _this3._isTransitioning = false;
        $$$1(_this3._element).trigger(shownEvent);

        _this3._adjustLayer();
      };

      if (transition) {
        var transitionDuration = Util.getTransitionDurationFromElement(this._element);
        $$$1(this._element).one(Util.TRANSITION_END, transitionComplete).emulateTransitionEnd(transitionDuration);
      } else {
        transitionComplete();
      }
    };

    _proto._enforceFocus = function _enforceFocus() {
      var _this4 = this;

      $$$1(document).off(Event.FOCUSIN) // Guard against infinite focus loop
      .on(Event.FOCUSIN, function (event) {
        if (document !== event.target && _this4._element !== event.target && $$$1(_this4._element).has(event.target).length === 0) {
          _this4._element.focus();
        }
      });
    };

    _proto._setEscapeEvent = function _setEscapeEvent() {
      var _this5 = this;

      if (this._isShown && this._config.keyboard) {
        $$$1(this._element).on(Event.KEYDOWN_DISMISS, function (event) {
          if (event.which === ESCAPE_KEYCODE) {
            event.preventDefault();

            _this5.hide();
          }
        });
      } else if (!this._isShown) {
        $$$1(this._element).off(Event.KEYDOWN_DISMISS);
      }
    };

    _proto._setResizeEvent = function _setResizeEvent() {
      var _this6 = this;

      if (this._isShown) {
        $$$1(window).on(Event.RESIZE, function (event) {
          return _this6.update(event);
        });
      } else {
        $$$1(window).off(Event.RESIZE);
      }
    };

    _proto._hideLayer = function _hideLayer() {
      var _this7 = this;

      this._element.style.display = 'none';

      this._element.setAttribute('aria-hidden', true);

      this._isTransitioning = false;

      this._showBackdrop(function () {
        if (_this7._config.fixed) {
          $$$1(document.body).removeClass(ClassName.OPEN);
        }

        _this7._resetAdjustments();

        _this7._resetScrollbar();

        $$$1(_this7._element).trigger(Event.HIDDEN);
      });
    };

    _proto._removeBackdrop = function _removeBackdrop() {
      if (this._backdrop) {
        $$$1(this._backdrop).remove();
        this._backdrop = null;
      }
    };

    _proto._showBackdrop = function _showBackdrop(callback) {
      var _this8 = this;

      var animate = $$$1(this._element).hasClass(ClassName.FADE) ? ClassName.FADE : '';

      if (this._isShown && this._config.backdrop) {
        this._backdrop = document.createElement('div');
        this._backdrop.className = ClassName.BACKDROP;

        if (animate) {
          $$$1(this._backdrop).addClass(animate);
        }

        $$$1(this._backdrop).appendTo(document.body).addClass('tui');
        $$$1(this._backdrop).on(Event.CLICK_DISMISS, function (event) {
          if (event.target !== event.currentTarget) {
            return;
          }

          if (_this8._config.backdrop === 'static') {
            _this8._element.focus();
          } else {
            _this8.hide();
          }
        });

        if (animate) {
          Util.reflow(this._backdrop);
        }

        $$$1(this._backdrop).addClass(ClassName.SHOW);

        if (!callback) {
          return;
        }

        if (!animate) {
          callback();
          return;
        }

        var backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);
        $$$1(this._backdrop).one(Util.TRANSITION_END, callback).emulateTransitionEnd(backdropTransitionDuration);
      } else if (!this._isShown && this._backdrop) {
        $$$1(this._backdrop).removeClass(ClassName.SHOW);

        var callbackRemove = function callbackRemove() {
          _this8._removeBackdrop();

          if (callback) {
            callback();
          }
        };

        if ($$$1(this._element).hasClass(ClassName.FADE)) {
          var _backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);

          $$$1(this._backdrop).one(Util.TRANSITION_END, callbackRemove).emulateTransitionEnd(_backdropTransitionDuration);
        } else {
          callbackRemove();
        }
      } else if (callback) {
        callback();
      }
    }; // ----------------------------------------------------------------------
    // the following methods are used to handle overflowing modals
    // todo (fat): these should probably be refactored out of modal.js
    // ----------------------------------------------------------------------


    _proto._adjustLayer = function _adjustLayer() {
      var isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

      if (!this._isBodyOverflowing && isModalOverflowing) {
        this._element.style.paddingLeft = this._scrollbarWidth + "px";
      }

      if (this._isBodyOverflowing && !isModalOverflowing) {
        this._element.style.paddingRight = this._scrollbarWidth + "px";
      }

      this._getPlacement();
    };

    _proto._resetAdjustments = function _resetAdjustments() {
      this._element.style.paddingLeft = '';
      this._element.style.paddingRight = '';
    };

    _proto._checkScrollbar = function _checkScrollbar() {
      var rect = document.body.getBoundingClientRect();
      this._isBodyOverflowing = rect.left + rect.right < window.innerWidth;
      this._scrollbarWidth = this._getScrollbarWidth();
    };

    _proto._setScrollbar = function _setScrollbar() {
      var _this9 = this;

      if (this._isBodyOverflowing) {
        // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
        //   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set
        // Adjust fixed content padding
        $$$1(Selector.FIXED_CONTENT).each(function (index, element) {
          var actualPadding = $$$1(element)[0].style.paddingRight;
          var calculatedPadding = $$$1(element).css('padding-right');
          $$$1(element).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + _this9._scrollbarWidth + "px");
        }); // Adjust sticky content margin

        $$$1(Selector.STICKY_CONTENT).each(function (index, element) {
          var actualMargin = $$$1(element)[0].style.marginRight;
          var calculatedMargin = $$$1(element).css('margin-right');
          $$$1(element).data('margin-right', actualMargin).css('margin-right', parseFloat(calculatedMargin) - _this9._scrollbarWidth + "px");
        }); // Adjust navbar-toggler margin

        $$$1(Selector.NAVBAR_TOGGLER).each(function (index, element) {
          var actualMargin = $$$1(element)[0].style.marginRight;
          var calculatedMargin = $$$1(element).css('margin-right');
          $$$1(element).data('margin-right', actualMargin).css('margin-right', parseFloat(calculatedMargin) + _this9._scrollbarWidth + "px");
        }); // Adjust body padding

        var actualPadding = document.body.style.paddingRight;
        var calculatedPadding = $$$1(document.body).css('padding-right');
        $$$1(document.body).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + this._scrollbarWidth + "px");
      }
    };

    _proto._resetScrollbar = function _resetScrollbar() {
      // Restore fixed content padding
      $$$1(Selector.FIXED_CONTENT).each(function (index, element) {
        var padding = $$$1(element).data('padding-right');

        if (typeof padding !== 'undefined') {
          $$$1(element).css('padding-right', padding).removeData('padding-right');
        }
      }); // Restore sticky content and navbar-toggler margin

      $$$1(Selector.STICKY_CONTENT + ", " + Selector.NAVBAR_TOGGLER).each(function (index, element) {
        var margin = $$$1(element).data('margin-right');

        if (typeof margin !== 'undefined') {
          $$$1(element).css('margin-right', margin).removeData('margin-right');
        }
      }); // Restore body padding

      var padding = $$$1(document.body).data('padding-right');

      if (typeof padding !== 'undefined') {
        $$$1(document.body).css('padding-right', padding).removeData('padding-right');
      }
    };

    _proto._getScrollbarWidth = function _getScrollbarWidth() {
      // thx d.walsh
      var scrollDiv = document.createElement('div');
      scrollDiv.className = ClassName.SCROLLBAR_MEASURER;
      document.body.appendChild(scrollDiv);
      var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      return scrollbarWidth;
    }; // Static


    Layer._jQueryInterface = function _jQueryInterface(config, relatedTarget) {
      return this.each(function () {
        var data = $$$1(this).data(DATA_KEY);

        var _config = _extends({}, Layer.Default, $$$1(this).data(), typeof config === 'object' && config);

        if (!data) {
          data = new Layer(this, _config);
          $$$1(this).data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config](relatedTarget);
        } else if (_config.show) {
          data.show(relatedTarget);
        }
      });
    };

    _createClass(Layer, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default;
      }
    }]);
    return Layer;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $$$1(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
    var _this10 = this;

    var target;
    var selector = Util.getSelectorFromElement(this);

    if (selector) {
      target = $$$1(selector)[0];
    }

    if (!target) {
      target = document.createElement('div');
      target.className = 'layer';
      $$$1(target).appendTo(document.body).addClass('tui').addClass('auto-generated-layer');
    }

    var config = $$$1(target).data(DATA_KEY) ? 'toggle' : _extends({}, $$$1(target).data(), $$$1(this).data());

    if (this.tagName === 'A' || this.tagName === 'AREA') {
      event.preventDefault();
    }

    var $target = $$$1(target).one(Event.SHOW, function (showEvent) {
      if (showEvent.isDefaultPrevented()) {
        // Only register focus restorer if layer will actually get shown
        return;
      }

      $target.one(Event.HIDDEN, function () {
        if ($$$1(_this10).is(':visible')) {
          _this10.focus();
        }
      });
    });

    Layer._jQueryInterface.call($$$1(target), config, this);
  }); // remove ajax content and remove cache on modal closed

  $$$1(document).on('hidden.tui.layer', '.layer:not(.layer-cached)', function () {
    $$$1(this).removeData(DATA_KEY);
  });
  $$$1(document).on('hidden.tui.layer', '.auto-generated-layer', function () {
    $$$1(this).removeData(DATA_KEY);
    $$$1(this).remove();
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $$$1.fn[NAME] = Layer._jQueryInterface;
  $$$1.fn[NAME].Constructor = Layer;

  $$$1.fn[NAME].noConflict = function () {
    $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
    return Layer._jQueryInterface;
  };

  return Layer;
}($);

var Tab = function ($$$1) {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  var NAME = 'tab';
  var VERSION = '4.0.0';
  var DATA_KEY = 'tui.tab';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
  var Event = {
    HIDE: "hide" + EVENT_KEY,
    HIDDEN: "hidden" + EVENT_KEY,
    SHOW: "show" + EVENT_KEY,
    SHOWN: "shown" + EVENT_KEY,
    CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
  };
  var ClassName = {
    POPOUT_MENU: 'popout-menu',
    ACTIVE: 'active',
    DISABLED: 'disabled',
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector = {
    POPOUT: '.popout',
    NAV_LIST_GROUP: '.nav, .list-group',
    ACTIVE: '.active',
    ACTIVE_UL: '> li > .active',
    DATA_TOGGLE: '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',
    POPOUT_TOGGLE: '.popout-toggle',
    POPOUT_ACTIVE_CHILD: '> .popout-menu .active'
  };
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Tab =
  /*#__PURE__*/
  function () {
    function Tab(element) {
      this._element = element;
    } // Getters


    var _proto = Tab.prototype;

    // Public
    _proto.show = function show() {
      var _this = this;

      if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && $$$1(this._element).hasClass(ClassName.ACTIVE) || $$$1(this._element).hasClass(ClassName.DISABLED)) {
        return;
      }

      var target;
      var previous;
      var listElement = $$$1(this._element).closest(Selector.NAV_LIST_GROUP)[0];
      var selector = Util.getSelectorFromElement(this._element);

      if (listElement) {
        var itemSelector = listElement.nodeName === 'UL' ? Selector.ACTIVE_UL : Selector.ACTIVE;
        previous = $$$1.makeArray($$$1(listElement).find(itemSelector));
        previous = previous[previous.length - 1];
      }

      var hideEvent = $$$1.Event(Event.HIDE, {
        relatedTarget: this._element
      });
      var showEvent = $$$1.Event(Event.SHOW, {
        relatedTarget: previous
      });

      if (previous) {
        $$$1(previous).trigger(hideEvent);
      }

      $$$1(this._element).trigger(showEvent);

      if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) {
        return;
      }

      if (selector) {
        target = $$$1(selector)[0];
      }

      this._activate(this._element, listElement);

      var complete = function complete() {
        var hiddenEvent = $$$1.Event(Event.HIDDEN, {
          relatedTarget: _this._element
        });
        var shownEvent = $$$1.Event(Event.SHOWN, {
          relatedTarget: previous
        });
        $$$1(previous).trigger(hiddenEvent);
        $$$1(_this._element).trigger(shownEvent);
      };

      if (target) {
        var url = $$$1(this._element).data('url');

        if (url) {
          $$$1(target).load(url, $$$1.proxy(function () {
            this._activate(target, target.parentNode, complete);
          }, this));
        } else {
          this._activate(target, target.parentNode, complete);
        }
      } else {
        complete();
      }
    };

    _proto.dispose = function dispose() {
      $$$1.removeData(this._element, DATA_KEY);
      this._element = null;
    }; // Private


    _proto._activate = function _activate(element, container, callback) {
      var _this2 = this;

      var activeElements;

      if (container.nodeName === 'UL') {
        activeElements = $$$1(container).find(Selector.ACTIVE_UL);
      } else {
        activeElements = $$$1(container).children(Selector.ACTIVE);
      }

      var active = activeElements[0];
      var isTransitioning = callback && active && $$$1(active).hasClass(ClassName.FADE);

      var complete = function complete() {
        return _this2._transitionComplete(element, active, callback);
      };

      if (active && isTransitioning) {
        var transitionDuration = Util.getTransitionDurationFromElement(active);
        $$$1(active).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    };

    _proto._transitionComplete = function _transitionComplete(element, active, callback) {
      if (active) {
        $$$1(active).removeClass(ClassName.SHOW + " " + ClassName.ACTIVE);
        var popoutChild = $$$1(active.parentNode).find(Selector.POPOUT_ACTIVE_CHILD)[0];

        if (popoutChild) {
          $$$1(popoutChild).removeClass(ClassName.ACTIVE);
        }

        if (active.getAttribute('role') === 'tab') {
          active.setAttribute('aria-selected', false);
        }
      }

      $$$1(element).addClass(ClassName.ACTIVE);

      if (element.getAttribute('role') === 'tab') {
        element.setAttribute('aria-selected', true);
      }

      Util.reflow(element);
      $$$1(element).addClass(ClassName.SHOW);

      if (element.parentNode && $$$1(element.parentNode).hasClass(ClassName.POPOUT_MENU)) {
        var popoutElement = $$$1(element).closest(Selector.POPOUT)[0];

        if (popoutElement) {
          $$$1(popoutElement).find(Selector.POPOUT_TOGGLE).addClass(ClassName.ACTIVE);
        }

        element.setAttribute('aria-expanded', true);
      }

      if (callback) {
        callback();
      }
    }; // Static


    Tab._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $this = $$$1(this);
        var data = $this.data(DATA_KEY);

        if (!data) {
          data = new Tab(this);
          $this.data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(Tab, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }]);
    return Tab;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $$$1(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
    event.preventDefault();

    Tab._jQueryInterface.call($$$1(this), 'show');
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $$$1.fn[NAME] = Tab._jQueryInterface;
  $$$1.fn[NAME].Constructor = Tab;

  $$$1.fn[NAME].noConflict = function () {
    $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
    return Tab._jQueryInterface;
  };

  return Tab;
}($);

var Table = function ($$$1) {
  var NAME = 'table';
  var VERSION = '4.0.0';
  var DATA_KEY = 'tui.table';
  var EVENT_KEY = "." + DATA_KEY;
  var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
  var Selector = {
    DATA_TOGGLE: '[data-toggle="tui-table"]',
    PAGE_TOGGLE: '[data-toggle="tui-table-page"]',
    SORT_TOGGLE: '[data-toggle="tui-table-sort"]',
    FILTER_TOGGLE: '[data-toggle="tui-table-filter"]'
  };
  var Default = {
    url: '',
    page: false,
    size: false,
    total: false,
    draw: true,
    fields: '',
    caption: '',
    method: 'get',
    pageTpl: '翻页',
    pageNum: 7,
    sort: '',
    filter: ''
  };
  var DefaultType = {
    url: 'string',
    page: '(boolean|number)',
    size: '(boolean|number)',
    total: '(boolean|number)',
    draw: 'boolean',
    fields: 'string',
    caption: 'string',
    method: 'string',
    pageTpl: 'string',
    pageNum: 'number',
    sort: 'string',
    filter: 'string'
  };
  var ClassName = {
    TABLE: 'tui-table',
    ROW: 'tui-table-row',
    ROW_SELECTED: 'tui-table-row-selected',
    TABLE_CELL: 'tui-table-cell text-truncate',
    TABLE_CELL_FILTER: 'tui-table-cell-filter',
    TABLE_FOOTER: 'tui-table-footer',
    TABLE_HEADER: 'tui-table-header',
    TABLE_SORT: 'tui-table-sort',
    TABLE_SORT_DESC: 'tui-table-sort-desc',
    TABLE_FILTER_TOGGLE: 'tui-table-filter-toggle',
    TABLE_FILTER: 'tui-table-filter'
  };
  var Event = {
    CLICK_PAGE: "click.page" + EVENT_KEY,
    CLICK_SORT: "click.sort" + EVENT_KEY,
    CLICK_FILTER: "click.filter" + EVENT_KEY,
    CLICK_SELECT: "click.select" + EVENT_KEY
  };

  var Table =
  /*#__PURE__*/
  function () {
    function Table(container, element, config) {
      this._config = this._getConfig(config);
      this._element = element;
      this._isShown = false;
      this._container = container;
      this._rows = [];
      this._headers = [];
      this._sorted = false;

      if (this._config.pageNum % 2 === 0) {
        this._config.pageNum += 1;
      }

      if (this._config['sort'].length > 0) {
        var sort = this._config['sort'].split('|');

        var sorts = {};
        $$$1(sort).each(function (i, d) {
          var sortValues = d.split(',');
          sorts[sortValues[0]] = {
            'key': sortValues[0],
            'dir': sortValues[1] ? sortValues[1] : 'asc'
          };
        });
        this._config['sort'] = sorts;
      } // 创建header


      if ($$$1("." + ClassName.TABLE_HEADER, this._container).length === 0) {
        var headerDiv = document.createElement('div');
        headerDiv.className = ClassName.TABLE_HEADER;
        $$$1(this._container).prepend(headerDiv);
      } // 创建footer


      if ($$$1("." + ClassName.TABLE_FOOTER, this._container).length === 0) {
        var footerDiv = document.createElement('div');
        footerDiv.className = ClassName.TABLE_FOOTER;

        this._container.appendChild(footerDiv);
      }

      if ($$$1("." + ClassName.TABLE_FOOTER, this._container).find('.tui-table-pagination').length === 0) {
        $$$1("." + ClassName.TABLE_FOOTER, this._container).prepend('<div class="tui-table-pagination"></div>');
      }

      if (this._config.filter.length > 0) {
        var filter = this._config.filter.split('|');

        var filters = {};
        $$$1(filter).each(function (i, d) {
          filters[d] = {
            'key': d,
            'value': ''
          };
        });
        this._config.filter = filters;
      }

      var that = this; // 选取

      $$$1(this._container).on(Event.CLICK_SELECT, "." + ClassName.ROW, function () {
        $$$1("." + ClassName.ROW, that._container).removeClass(ClassName.ROW_SELECTED);
        $$$1(this).addClass(ClassName.ROW_SELECTED);
      }); // 分页

      $$$1(this._container).on(Event.CLICK_PAGE, Selector.PAGE_TOGGLE, function () {
        that._config.page = $$$1(this).data('page');

        that._getData(function () {
          that._drawTableBody('page');

          that._drawPage('page');
        });
      }); // sort

      $$$1(this._container).on(Event.CLICK_SORT, Selector.SORT_TOGGLE, function () {
        var sortKey = $$$1(this).parent('th').data('key');
        that._config['sort'][sortKey]['dir'] = $$$1(this).hasClass(ClassName.TABLE_SORT_DESC) ? 'asc' : 'desc';
        that._sorted = true;

        that._getData(function () {
          that._drawTableBody('sort');

          that._drawPage('sort');

          that._drawSort('sort');
        });
      }); // filter

      $$$1(this._container).on(Event.CLICK_FILTER, Selector.FILTER_TOGGLE, function () {
        var $target = $$$1($$$1(this).data('target'));
        $target.toggleClass('show');
      });
      $$$1(this._container).on('input', '.tui-table-filter-input', function () {
        var $input = $$$1(this);
        var key = this.getAttribute('name');
        that._config.filter[key].value = $input.val();

        that._getData(function () {
          that._drawTableBody('filter');

          that._drawPage('filter');
        });
      });
    }

    var _proto = Table.prototype;

    _proto.dispose = function dispose() {
      this._config = null;
      this._element = null;
      this._container = null;
      this._isShown = null;
      this._headers = null;
      this._rows = null;
    }; // Getters


    // Public
    _proto.toggle = function toggle() {
      var that = this;

      this._getData(function () {
        that._drawTable('toggle');

        that._drawPage('toggle');

        that._isShown = true;
      });
    }; // Private


    _proto._drawSort = function _drawSort(scope) {
      console.log('draw sort when "' + scope + '"');
      var that = this;
      $$$1(this._headers).each(function (i, d) {
        if (that._config['sort'][d['key']]) {
          var sortConfig = that._config['sort'][d['key']];
          var $sortDiv = $$$1('thead th[data-key="' + d['key'] + '"]', that._element).find(Selector.SORT_TOGGLE);
          $sortDiv.removeClass(ClassName.TABLE_SORT_DESC);

          if (sortConfig['dir'] !== 'asc') {
            $sortDiv.addClass(ClassName.TABLE_SORT_DESC);
          }
        }
      });
    };

    _proto._drawPage = function _drawPage(scope) {
      console.log('draw page when "' + scope + '"');
      var html = '';
      html += '<nav aria-label="Page navigation"><ul class="tui-table-pager">';

      if (this._config.total <= 0) {
        html += '<li>未查询到数据</li>';
        html += '</ul></nav>';
        $$$1("." + ClassName.TABLE_FOOTER, this._container).find('.tui-table-pagination').empty().html(html);
        return;
      }

      html += '<li>' + this._config.pageTpl + '</li>';
      html += '<li><a href="javascript:void(0);" data-toggle="tui-table-page" data-page="1" aria-label="Previous"><span aria-hidden="true">&laquo;</span><span class="sr-only">First</span></a></li>';
      var lastPage = Math.ceil(this._config.total / this._config.size);
      var currentPage = Math.min(Math.max(1, parseInt(this._config.page)), lastPage);
      var delta = (parseInt(this._config.pageNum) - 1) / 2;
      var left = 0;
      var right = 0;
      var currentPageHtml = '<li><a class="active" href="javascript:void(0);" data-toggle="tui-table-page" data-page="' + currentPage + '">' + currentPage + '</a></li>';
      var prevPage = parseInt(currentPage) - 1;
      var nextPage = parseInt(currentPage) + 1;
      var leftStop = false;
      var rightStop = false; // if (scope === 'filter') {
      //     console.log('here', left, right, delta);
      // }

      while (left < delta && right < delta) {
        // console.log('here', left, right, delta, leftStop, rightStop);
        if (!leftStop) {
          if (prevPage > 1) {
            currentPageHtml = '<li><a href="javascript:void(0);" data-toggle="tui-table-page" data-page="' + prevPage + '">' + prevPage + '</a></li>' + currentPageHtml;
            prevPage -= 1;
            left += 1;
          } else if (left < delta) {
            right -= delta - left;
            leftStop = true;
          }
        }

        if (!rightStop) {
          if (nextPage < lastPage) {
            right += 1;
            currentPageHtml += '<li><a href="javascript:void(0);" data-toggle="tui-table-page" data-page="' + nextPage + '">' + nextPage + '</a></li>';
            nextPage += 1;
          } else if (right < delta) {
            rightStop = true;
            left -= delta - right;
          }
        }

        if (leftStop && rightStop) {
          break;
        }
      }

      if (prevPage > 0) {
        currentPageHtml = '<li><a href="javascript:void(0);" data-toggle="tui-table-page" data-page="' + (currentPage - 1) + '">...</a></li>' + currentPageHtml;
      }

      if (nextPage <= lastPage) {
        currentPageHtml += '<li><a href="javascript:void(0);" data-toggle="tui-table-page" data-page="' + (currentPage + 1) + '">...</a></li>';
      }

      html += currentPageHtml;
      html += '<li><a href="javascript:void(0);" data-toggle="tui-table-page" data-page="' + lastPage + '" aria-label="Previous"><span aria-hidden="true">&raquo;</span><span class="sr-only">Last</span></a></li>';
      html += '<li>共 ' + this._config.total + '</li>';
      html += '</ul></nav>';
      $$$1("." + ClassName.TABLE_FOOTER, this._container).find('.tui-table-pagination').empty().html(html);
    };

    _proto._drawTable = function _drawTable(scope) {
      console.log('draw table when "' + scope + '"');
      $$$1(this._element).removeClass(ClassName.TABLE).addClass(ClassName.TABLE).empty();
      var html = ''; // caption

      if (this._config.caption) {
        html += '<caption>' + this._config.caption + '</caption>';
      }

      html += '<thead></thead><tbody></tbody><tfoot></tfoot>';
      $$$1(this._element).html(html);

      this._drawTableHeader(scope);

      this._drawTableBody(scope);

      this._drawTableFooter(scope);
    };

    _proto._drawTableHeader = function _drawTableHeader(scope) {
      console.log('draw table header when "' + scope + '"');

      if (this._headers.length > 0) {
        var html = '';
        html += '<tr>';
        var that = this;
        $$$1(this._headers).each(function (i, d) {
          html += '<th data-key="' + d['key'] + '" title="' + d['name'] + '" style="' + d['style'] + '">';
          html += '<div class="' + ClassName.TABLE_CELL + '">' + d['name'] + '</div>';

          if (that._config.filter[d['key']]) {
            var item = that._config.filter[d['key']];
            html += '<div class="' + ClassName.TABLE_FILTER_TOGGLE + '" data-toggle="tui-table-filter" data-target="#filter-' + d['key'] + '">';
            html += '</div>';
            html += '<div class="tui-control tui-table-filter-control" id="filter-' + d['key'] + '"><input type="text" name="' + d['key'] + '" class="tui-input tui-table-filter-input" value="' + item['value'] + '"></div>';
          }

          if (that._config['sort'][d['key']]) {
            var sortConfig = that._config['sort'][d['key']];

            if (sortConfig['dir'] === 'asc') {
              html += '<div data-toggle="tui-table-sort" class="' + ClassName.TABLE_SORT + '"></div>';
            } else {
              html += '<div data-toggle="tui-table-sort" class="' + ClassName.TABLE_SORT + ' ' + ClassName.TABLE_SORT_DESC + '"></div>';
            }
          }

          html += '</th>';
        });
        html += '</tr>';
        $$$1('thead', this._element).empty().html(html);
      }
    };

    _proto._drawTableBody = function _drawTableBody(scope) {
      console.log('draw table body when "' + scope + '"'); // rows

      var html = '';
      var that = this;
      $$$1(this._rows).each(function (i, d) {
        var row = '<tr class="' + ClassName.ROW + ' ' + ClassName.ROW + '-' + i + '">';
        $$$1(that._headers).each(function (j, h) {
          var cell = d[j];
          var cellClass = ClassName.TABLE_CELL;

          if (that._config.filter[h['key']] && that._config.filter[h['key']]['value'] !== '') {
            cellClass += ' ' + ClassName.TABLE_CELL_FILTER;
          }

          row += '<td><div class="' + cellClass + '" style="' + h['style'] + '">' + cell + '</div></td>';
        });
        row += '</tr>';
        html += row;
      });
      $$$1('tbody', this._element).empty().html(html);
    };

    _proto._drawTableFooter = function _drawTableFooter(scope) {
      console.log('draw table footer when "' + scope + '"');
    };

    _proto._getConfig = function _getConfig(config) {
      config = _extends({}, Default, config);
      Util.typeCheckConfig(NAME, config, DefaultType);
      return config;
    };

    _proto._getData = function _getData(callback) {
      if (!this._config.caption) {
        this._config.caption = $$$1(this._element).find('caption').html();
      }

      var _headers = [];
      var _rows = [];

      if (this._config.url) {
        // 解析fields
        if (this._config.fields.length > 0) {
          $$$1(this._config.fields.split('|')).each(function (i, d) {
            var col = d.split(',', 3);

            _headers.push({
              'key': col[0],
              'name': col[1],
              'style': col[2] ? col[2] : ''
            });
          });
        }

        this._headers = _headers;
        var data = {};
        data.page = Math.max(1, this._config.page);

        if (this._isShown) {
          data.filter = this._config.filter;

          if (this._sorted) {
            data.sort = this._config.sort;
          }
        }

        var that = this;
        $$$1.ajax({
          url: this._config.url,
          type: this._config.method,
          data: data,
          success: function success(data) {
            that._rows = [];
            that._config.page = data['page'];
            that._config.size = data['size'];
            that._config.total = data['total'];

            if (data['sort']) {
              that._config.sort = data['sort'];
            }

            if (data['filter']) {
              that._config.filter = data['filter'];
            }

            var rows = data['data'];

            if (typeof rows === 'object') {
              $$$1(rows).each(function (i, d) {
                var r = [];
                $$$1(that._headers).each(function (i, p) {
                  r.push(d[p['key']]);
                });

                that._rows.push(r);
              });
              callback.call(that);
            }
          }
        });
      } else {
        var cells = $$$1(this._element).find('thead > tr > th, thead > tr > td');
        $$$1(cells).each(function (i, d) {
          var $e = $$$1(d);

          _headers.push({
            'key': $e.data('key'),
            'name': $e.html(),
            'style': d.getAttribute('style')
          });
        });
        this._headers = _headers;
        var rs = $$$1(this._element).find('tbody > tr');
        $$$1(rs).each(function (i, d) {
          var r = [];
          var cells = $$$1(d).find('th, td');
          $$$1(cells).each(function (i, d) {
            r.push($$$1(d).html());
          });

          _rows.push(r);
        });
        this._rows = _rows;
        callback();
      }
    }; // Static


    Table._jQueryInterface = function _jQueryInterface(relatedTarget, config) {
      return this.each(function () {
        var data = $$$1(this).data(DATA_KEY);

        var _config = _extends({}, Table.Default, $$$1(this).data(), typeof config === 'object' && config);

        if (!data) {
          data = new Table(relatedTarget, this, _config);
          $$$1(this).data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config](relatedTarget);
        } else if (_config.toggle) {
          data.toggle(relatedTarget);
        }
      });
    };

    _createClass(Table, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default;
      }
    }]);
    return Table;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $$$1(document).ready(function () {
    var $element = $$$1(Selector.DATA_TOGGLE);

    if ($element.length) {
      var target;
      var selector = Util.getSelectorFromElement($element[0]);

      if (selector) {
        target = $$$1(selector)[0];
      }

      var config = $$$1(target).data(DATA_KEY) ? 'toggle' : _extends({}, $$$1(target).data(), $element.data());

      Table._jQueryInterface.call($$$1(target), $element[0], config);
    }
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $$$1.fn[NAME] = Table._jQueryInterface;
  $$$1.fn[NAME].Constructor = Table;

  $$$1.fn[NAME].noConflict = function () {
    $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
    return Table._jQueryInterface;
  };

  return Table;
}($);

var Select3 = function ($$$1) {
  var NAME = 'select3';
  var DATA_KEY = 'tui.select3';
  var EVENT_KEY = "." + DATA_KEY;
  var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
  var Default = {
    placeholder: '',
    search: false
  };
  var DefaultType = {
    placeholder: 'string',
    search: 'boolean'
  };
  var Event = {
    // HIDE              : `hide${EVENT_KEY}`,
    // HIDDEN            : `hidden${EVENT_KEY}`,
    // SHOW              : `show${EVENT_KEY}`,
    CLICK_SHOW: "click.show" + EVENT_KEY,
    CLICK_SELECT: "click.select" + EVENT_KEY,
    CLICK_RESET: "click.reset" + EVENT_KEY,
    CLICK_REMOVE: "click.remove" + EVENT_KEY,
    // SHOWN             : `shown${EVENT_KEY}`,
    // LOADED            : `loaded${EVENT_KEY}`,
    // FOCUSIN           : `focusin${EVENT_KEY}`,
    // RESIZE            : `resize${EVENT_KEY}`,
    CLICK_DISMISS: "click.dismiss" + EVENT_KEY // KEYDOWN_DISMISS   : `keydown.dismiss${EVENT_KEY}`,
    // MOUSEUP_DISMISS   : `mouseup.dismiss${EVENT_KEY}`,
    // MOUSEDOWN_DISMISS : `mousedown.dismiss${EVENT_KEY}`,
    // CLICK_DATA_API    : `click${EVENT_KEY}${DATA_API_KEY}`

  };
  var ClassName = {
    BACKDROP: 'tui-select-backdrop',
    CONTAINER_ACTIVE: 'tui-select-container-active',
    POPOUT: 'tui-select-popout',
    CONTAINER: 'tui-select-container' // SCROLLBAR_MEASURER : 'layer-scrollbar-measure',
    // BACKDROP           : 'layer-backdrop',
    // FADE               : 'fade',
    // SHOW               : 'show',
    // LAYER              : 'layer-inner'

  };
  var Selector = {
    DATA_TOGGLE: '[data-toggle="tui-select"]'
  };

  var Select3 =
  /*#__PURE__*/
  function () {
    function Select3(element, config) {
      this._config = this._getConfig(config);
      this._element = element;
      this._isShown = false;
      this._allowClear = !!this._config.placeholder;
      this._isMultiple = $$$1(element).prop('multiple');
    } // Public


    var _proto = Select3.prototype;

    _proto.toggle = function toggle() {
      // 绘制
      var $element = $$$1(this._element);
      $element.addClass('d-none');
      var html = '';

      if (this._isMultiple) {
        html += '<div class="tui tui-select-container tui-select-container-multiple">';
      } else {
        html += '<div class="tui tui-select-container">';
      }

      if (this._isMultiple) {
        html += '<ul class="tui-select-choices list-unstyled d-flex mb-0">'; // html += '<li class="tui-select-search-choice"><div>aaaaaaaaaaa</div><a href="javascript:void(0);" class="tui-select-search-choice-close" tabindex="-1">×</a></li>';

        html += '<li class="tui-select-search-field">';
        html += '<input type="text" autocomplete="off">';
        html += '</li>';
        html += '</ul>';
      } else {
        html += '<a href="javascript:void(0);" class="tui-select-choice" tabindex="-1">';
        html += '<span>&nbsp;</span>';

        if (this._allowClear) {
          html += '<abbr class="tui-select-search-choice-close" style="">×</abbr>';
        }

        html += '</a>';
      }

      html += '</div>';
      $element.parent().prepend(html);
      var that = this;

      var $container = this._getContainer();

      $container.on("" + Event.CLICK_SHOW, function () {
        if (!that._isShown) {
          that.show();
        } else {
          that.hide();
        }
      });
      var $options = $$$1('option:selected', this._element);

      if (this._isMultiple) {
        // 多选
        if ($options.length > 0) {
          $options.each(function (i, d) {
            var $option = $$$1(d);
            var text = $option.html();
            var value = d.getAttribute('value');
            var html = '<li class="tui-select-search-choice">' + '<div>' + text + '</div>' + '<a href="javascript:void(0);" data-value="' + value + '" class="tui-select-search-choice-close" tabindex="-1">×</a>' + '</li>';
            $container.find('.tui-select-choices > .tui-select-search-field').before(html);
          });
        }

        $container.on("" + Event.CLICK_REMOVE, '.tui-select-search-choice-close', function (e) {
          e.preventDefault();
          e.stopPropagation();
          var $this = $$$1(this);
          var value = $this.data('value');
          $$$1(this).parent().remove();
          $$$1('option:selected', that._element).each(function (i, d) {
            var v = d.getAttribute('value');

            if (v == value) {
              $$$1(d).prop('selected', false);
            }
          });
        });
      } else {
        // 单选
        var _html = '&nbsp;';
        var isShowPlaceholder = false;

        if ($options.length > 0) {
          var $option = $$$1($options[0]);
          _html = $option.html();

          if (_html.length === 0 && this._config.placeholder) {
            _html = this._config.placeholder;
            isShowPlaceholder = true;
          }
        } else if (!this._config.placeholder) {
          _html = this._config.placeholder;
          isShowPlaceholder = true;
        }

        if (isShowPlaceholder) {
          $container.find('.tui-select-search-choice-close').removeClass('d-none').addClass('d-none');
          $container.find('.tui-select-choice > span').removeClass('text-muted').addClass('text-muted');
        }

        $container.find('.tui-select-choice > span').html(_html);
        $container.on("" + Event.CLICK_RESET, '.tui-select-search-choice-close', function (e) {
          e.preventDefault();
          e.stopPropagation();
          $$$1('option:selected', that._element).each(function (i, d) {
            if (i === 0 && that._config.placeholder) {
              $$$1(d).prop('selected', true);
            } else {
              $$$1(d).prop('selected', false);
            }
          });
          $$$1(this).removeClass('d-none').addClass('d-none');
          var html = '&nbsp;';

          if (that._config.placeholder) {
            html = that._config.placeholder;
          }

          $container.find('.tui-select-choice > span').removeClass('text-muted').addClass('text-muted').html(html);
        });
      }

      this._drawBackdrop();
    };

    _proto.show = function show() {
      if (this._isShown) {
        return;
      }

      var $options = $$$1('option', this._element);
      var that = this;

      var $backdrop = this._drawBackdrop();

      $backdrop.on("" + Event.CLICK_DISMISS, function () {
        that.hide();
      });

      var $popout = this._drawPopout();

      this._isShown = true;
      $backdrop.toggleClass('d-none');
      $popout.toggleClass('d-none');

      var $container = this._getContainer();

      $container.toggleClass("" + ClassName.CONTAINER_ACTIVE);
      $popout.css({
        'width': $container.outerWidth() + 'px',
        'top': $container.offset().top + $container.outerHeight() + 'px',
        'left': $container.offset().left + 'px',
        'margin': 0,
        'margin-top': '1px'
      });

      if (!this._isMultiple) {
        $$$1('.tui-select-search', $popout).find('.tui-input').focus();
      } else {
        $$$1('.tui-select-search-field', $container).find('input').focus();
      } // 设置选项


      $options.each(function (i, d) {
        var $e = $$$1(d);
        var text = $e.html();
        var value = d.getAttribute('value');
        var selected = $e.prop('selected');
        var disabled = $e.prop('disabled');

        if (that._config.placeholder && i === 0) {
          disabled = true;
          text = that._config.placeholder;
          selected = false;
        }

        var html = '<li data-index="' + i + '" class="tui-select-item' + (disabled ? ' tui-select-item-disabled' : '') + (selected ? ' tui-select-item-selected' : '') + '">';
        html += '<div class="tui-select-item-label">';
        html += text;
        html += '</div>';
        html += '</li>';
        $popout.find('.tui-select-result').append(html);
      });
      $popout.off("" + Event.CLICK_SELECT).on("" + Event.CLICK_SELECT, ".tui-select-item:not(.tui-select-item-disabled)", function () {
        var $e = $$$1(this);
        var index = $e.data('index');
        var option = $$$1('option', that._element)[index];
        var $option = $$$1(option);

        if (!$option.prop('selected')) {
          // 选择
          $option.prop('selected', true);

          if (!that._isMultiple) {
            // 单选
            $container.find('.tui-select-choice > span').removeClass('text-muted').html($option.html());
            $container.find('.tui-select-search-choice-close').removeClass('d-none');
            that.hide();
          } else {
            // 多选
            var text = $option.html();
            var value = option.getAttribute('value');
            var html = '<li class="tui-select-search-choice">' + '<div>' + text + '</div>' + '<a href="javascript:void(0);" data-value="' + value + '" class="tui-select-search-choice-close" tabindex="-1">×</a>' + '</li>';
            $container.find('.tui-select-search-field').before(html);
            that.hide();
          }
        }
      });
    };

    _proto.hide = function hide() {
      if (!this._isShown) {
        return;
      }

      var $popout = this._drawPopout();

      var $backdrop = this._drawBackdrop();

      this._isShown = false;
      $backdrop.toggleClass('d-none');
      $backdrop.off("" + Event.CLICK_DISMISS);
      $popout.toggleClass('d-none');

      var $container = this._getContainer();

      $container.toggleClass("" + ClassName.CONTAINER_ACTIVE); // 清空选项和搜索

      if (!this._isMultiple) {
        $$$1('.tui-select-search', $popout).find('.tui-input').val('');
      } else {
        $$$1('.tui-select-search-field', $container).find('input').val('');
      }

      $popout.find('.tui-select-result').empty();
    };

    _proto.dispose = function dispose() {}; // Private


    _proto._selectItem = function _selectItem() {};

    _proto._getContainer = function _getContainer() {
      var $element = $$$1(this._element);
      return $element.parent().find("." + ClassName.CONTAINER);
    };

    _proto._drawPopout = function _drawPopout() {
      if ($$$1("." + ClassName.POPOUT, 'body').length === 0) {
        var html = '<div class="tui tui-select-popout d-none">';
        html += '<div class="tui-select-search p-1">';
        html += '<input type="text" autocomplete="off" class="tui-input">';
        html += '</div>';
        html += '<ul class="tui-select-result list-unstyled mb-0"></ul>';
        html += '</div>';
        $$$1('body').append(html);
      }

      var $popout = $$$1("." + ClassName.POPOUT, 'body');
      $popout.find('.tui-select-search').removeClass('d-none');

      if (!this._config.search || this._isMultiple) {
        $popout.find('.tui-select-search').addClass('d-none');
      }

      return $$$1("." + ClassName.POPOUT, 'body');
    };

    _proto._drawBackdrop = function _drawBackdrop() {
      if ($$$1("." + ClassName.BACKDROP, 'body').length === 0) {
        var html = '<div class="tui tui-select-backdrop d-none"></div>';
        $$$1('body').append(html);
      }

      return $$$1("." + ClassName.BACKDROP, 'body');
    };

    _proto._getConfig = function _getConfig(config) {
      config = _extends({}, Default, config);
      Util.typeCheckConfig(NAME, config, DefaultType);
      return config;
    }; // Static


    Select3._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $$$1(this).data(DATA_KEY);

        var _config = _extends({}, Select3.Default, $$$1(this).data(), typeof config === 'object' && config);

        if (!data) {
          data = new Select3(this, _config);
          $$$1(this).data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        } else if (_config.toggle) {
          data.toggle();
        }
      });
    };

    return Select3;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $$$1(document).ready(function () {
    $$$1(Selector.DATA_TOGGLE).each(function () {
      var $target = $$$1(this);
      var config = $target.data(DATA_KEY) ? 'toggle' : _extends({}, $target.data());

      Select3._jQueryInterface.call($target, config);
    });
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $$$1.fn[NAME] = Select3._jQueryInterface;
  $$$1.fn[NAME].Constructor = Select3;

  $$$1.fn[NAME].noConflict = function () {
    $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
    return Select3._jQueryInterface;
  };

  return Select3;
}($);

(function ($$$1) {
  if (typeof $$$1 === 'undefined') {
    throw new TypeError('TUI\'s JavaScript requires jQuery. jQuery must be included before TUI\'s JavaScript.');
  }

  var version = $$$1.fn.jquery.split(' ')[0].split('.');
  var minMajor = 1;
  var ltMajor = 2;
  var minMinor = 9;
  var minPatch = 1;
  var maxMajor = 4;

  if (version[0] < ltMajor && version[1] < minMinor || version[0] === minMajor && version[1] === minMinor && version[2] < minPatch || version[0] >= maxMajor) {
    throw new Error('TUI\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0');
  }
})($);

exports.Util = Util;
exports.Alert = Alert;
exports.Popout = Popout;
exports.Collapse = Collapse;
exports.Carousel = Carousel;
exports.Layer = Layer;
exports.Tab = Tab;
exports.Table = Table;
exports.Select3 = Select3;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=tui.js.map
