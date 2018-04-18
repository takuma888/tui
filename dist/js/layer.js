function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Layer = function ($) {
  var NAME = 'layer';
  var VERSION = '4.0.0';
  var DATA_KEY = 'tui.layer';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $.fn[NAME];
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
      this._layer = $(element).find(Selector.LAYER)[0];
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
          var loadedEvent = $.Event(Event.LOADED, {
            relatedTarget: relatedTarget
          });
          $(this._element).trigger(loadedEvent);
        };

        if (this._config.type === Type.iframe) {
          this._layer.src = this._config.url;

          if (this._layer.attachEvent) {
            this._layer.attachEvent('onload', loadFunction);
          } else {
            this._layer.onload = loadFunction;
          }

          $(this._layer).appendTo(this._element);
        } else {
          $(this._layer).appendTo(this._element);
          $(this._layer).load(this._config.url, $.proxy(loadFunction, this));
        }
      } else {
        if (!this._layer) {
          this._layer = document.createElement('div');
          this._layer.className = ClassName.LAYER;
          $(this._layer).appendTo(this._element);
        }
      }

      if ($(this._element).hasClass(ClassName.FADE)) {
        this._isTransitioning = true;
      }

      var showEvent = $.Event(Event.SHOW, {
        relatedTarget: relatedTarget
      });
      $(this._element).trigger(showEvent);

      if (this._isShown || showEvent.isDefaultPrevented()) {
        return;
      }

      this._isShown = true;

      this._checkScrollbar();

      this._setScrollbar();

      $(this._element).addClass(ClassName.SHOW).css({
        'z-index': LAYER_ZINDEX + LAYER_COUNT
      });

      if (this._config.width) {
        $(this._element).css({
          'width': this._config.width
        });
        $(this._layer).css({
          'width': this._config.width
        });
      }

      if (this._config.height) {
        $(this._element).css({
          'height': this._config.height
        });
        $(this._layer).css({
          'height': this._config.height
        });
      }

      if (this._config.fixed) {
        $(document.body).addClass(ClassName.OPEN);
      }

      this._setEscapeEvent();

      this._setResizeEvent();

      $(this._element).on(Event.CLICK_DISMISS, Selector.DATA_DISMISS, function (event) {
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

      var hideEvent = $.Event(Event.HIDE);
      $(this._element).trigger(hideEvent);

      if (!this._isShown || hideEvent.isDefaultPrevented()) {
        return;
      }

      this._isShown = false;
      var transition = $(this._element).hasClass(ClassName.FADE);

      if (transition) {
        this._isTransitioning = true;
      }

      this._setEscapeEvent();

      this._setResizeEvent();

      $(document).off(Event.FOCUSIN);
      $(this._element).removeClass(ClassName.SHOW);
      $(this._element).off(Event.CLICK_DISMISS);
      $(this._layer).off(Event.MOUSEDOWN_DISMISS);

      if (transition) {
        var transitionDuration = Util.getTransitionDurationFromElement(this._element);
        $(this._element).one(Util.TRANSITION_END, function (event) {
          return _this2._hideLayer(event);
        }).emulateTransitionEnd(transitionDuration);
      } else {
        this._hideLayer();
      }
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY);
      $(window, document, this._element, this._backdrop).off(EVENT_KEY);
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
      var $window = $(window);
      var $element = $(this._element);
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

      var transition = $(this._element).hasClass(ClassName.FADE);

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

      var shownEvent = $.Event(Event.SHOWN, {
        relatedTarget: relatedTarget
      });

      var transitionComplete = function transitionComplete() {
        if (_this3._config.focus) {
          _this3._element.focus();
        }

        _this3._isTransitioning = false;
        $(_this3._element).trigger(shownEvent);

        _this3._adjustLayer();
      };

      if (transition) {
        var transitionDuration = Util.getTransitionDurationFromElement(this._element);
        $(this._element).one(Util.TRANSITION_END, transitionComplete).emulateTransitionEnd(transitionDuration);
      } else {
        transitionComplete();
      }
    };

    _proto._enforceFocus = function _enforceFocus() {
      var _this4 = this;

      $(document).off(Event.FOCUSIN) // Guard against infinite focus loop
      .on(Event.FOCUSIN, function (event) {
        if (document !== event.target && _this4._element !== event.target && $(_this4._element).has(event.target).length === 0) {
          _this4._element.focus();
        }
      });
    };

    _proto._setEscapeEvent = function _setEscapeEvent() {
      var _this5 = this;

      if (this._isShown && this._config.keyboard) {
        $(this._element).on(Event.KEYDOWN_DISMISS, function (event) {
          if (event.which === ESCAPE_KEYCODE) {
            event.preventDefault();

            _this5.hide();
          }
        });
      } else if (!this._isShown) {
        $(this._element).off(Event.KEYDOWN_DISMISS);
      }
    };

    _proto._setResizeEvent = function _setResizeEvent() {
      var _this6 = this;

      if (this._isShown) {
        $(window).on(Event.RESIZE, function (event) {
          return _this6.update(event);
        });
      } else {
        $(window).off(Event.RESIZE);
      }
    };

    _proto._hideLayer = function _hideLayer() {
      var _this7 = this;

      this._element.style.display = 'none';

      this._element.setAttribute('aria-hidden', true);

      this._isTransitioning = false;

      this._showBackdrop(function () {
        if (_this7._config.fixed) {
          $(document.body).removeClass(ClassName.OPEN);
        }

        _this7._resetAdjustments();

        _this7._resetScrollbar();

        $(_this7._element).trigger(Event.HIDDEN);
      });
    };

    _proto._removeBackdrop = function _removeBackdrop() {
      if (this._backdrop) {
        $(this._backdrop).remove();
        this._backdrop = null;
      }
    };

    _proto._showBackdrop = function _showBackdrop(callback) {
      var _this8 = this;

      var animate = $(this._element).hasClass(ClassName.FADE) ? ClassName.FADE : '';

      if (this._isShown && this._config.backdrop) {
        this._backdrop = document.createElement('div');
        this._backdrop.className = ClassName.BACKDROP;

        if (animate) {
          $(this._backdrop).addClass(animate);
        }

        $(this._backdrop).appendTo(document.body).addClass('tui');
        $(this._backdrop).on(Event.CLICK_DISMISS, function (event) {
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

        $(this._backdrop).addClass(ClassName.SHOW);

        if (!callback) {
          return;
        }

        if (!animate) {
          callback();
          return;
        }

        var backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);
        $(this._backdrop).one(Util.TRANSITION_END, callback).emulateTransitionEnd(backdropTransitionDuration);
      } else if (!this._isShown && this._backdrop) {
        $(this._backdrop).removeClass(ClassName.SHOW);

        var callbackRemove = function callbackRemove() {
          _this8._removeBackdrop();

          if (callback) {
            callback();
          }
        };

        if ($(this._element).hasClass(ClassName.FADE)) {
          var _backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);

          $(this._backdrop).one(Util.TRANSITION_END, callbackRemove).emulateTransitionEnd(_backdropTransitionDuration);
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
        $(Selector.FIXED_CONTENT).each(function (index, element) {
          var actualPadding = $(element)[0].style.paddingRight;
          var calculatedPadding = $(element).css('padding-right');
          $(element).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + _this9._scrollbarWidth + "px");
        }); // Adjust sticky content margin

        $(Selector.STICKY_CONTENT).each(function (index, element) {
          var actualMargin = $(element)[0].style.marginRight;
          var calculatedMargin = $(element).css('margin-right');
          $(element).data('margin-right', actualMargin).css('margin-right', parseFloat(calculatedMargin) - _this9._scrollbarWidth + "px");
        }); // Adjust navbar-toggler margin

        $(Selector.NAVBAR_TOGGLER).each(function (index, element) {
          var actualMargin = $(element)[0].style.marginRight;
          var calculatedMargin = $(element).css('margin-right');
          $(element).data('margin-right', actualMargin).css('margin-right', parseFloat(calculatedMargin) + _this9._scrollbarWidth + "px");
        }); // Adjust body padding

        var actualPadding = document.body.style.paddingRight;
        var calculatedPadding = $(document.body).css('padding-right');
        $(document.body).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + this._scrollbarWidth + "px");
      }
    };

    _proto._resetScrollbar = function _resetScrollbar() {
      // Restore fixed content padding
      $(Selector.FIXED_CONTENT).each(function (index, element) {
        var padding = $(element).data('padding-right');

        if (typeof padding !== 'undefined') {
          $(element).css('padding-right', padding).removeData('padding-right');
        }
      }); // Restore sticky content and navbar-toggler margin

      $(Selector.STICKY_CONTENT + ", " + Selector.NAVBAR_TOGGLER).each(function (index, element) {
        var margin = $(element).data('margin-right');

        if (typeof margin !== 'undefined') {
          $(element).css('margin-right', margin).removeData('margin-right');
        }
      }); // Restore body padding

      var padding = $(document.body).data('padding-right');

      if (typeof padding !== 'undefined') {
        $(document.body).css('padding-right', padding).removeData('padding-right');
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
        var data = $(this).data(DATA_KEY);

        var _config = _extends({}, Layer.Default, $(this).data(), typeof config === 'object' && config);

        if (!data) {
          data = new Layer(this, _config);
          $(this).data(DATA_KEY, data);
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


  $(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
    var _this10 = this;

    var target;
    var selector = Util.getSelectorFromElement(this);

    if (selector) {
      target = $(selector)[0];
    }

    if (!target) {
      target = document.createElement('div');
      target.className = 'layer';
      $(target).appendTo(document.body).addClass('tui').addClass('auto-generated-layer');
    }

    var config = $(target).data(DATA_KEY) ? 'toggle' : _extends({}, $(target).data(), $(this).data());

    if (this.tagName === 'A' || this.tagName === 'AREA') {
      event.preventDefault();
    }

    var $target = $(target).one(Event.SHOW, function (showEvent) {
      if (showEvent.isDefaultPrevented()) {
        // Only register focus restorer if layer will actually get shown
        return;
      }

      $target.one(Event.HIDDEN, function () {
        if ($(_this10).is(':visible')) {
          _this10.focus();
        }
      });
    });

    Layer._jQueryInterface.call($(target), config, this);
  }); // remove ajax content and remove cache on modal closed

  $(document).on('hidden.tui.layer', '.layer:not(.layer-cached)', function () {
    $(this).removeData(DATA_KEY);
  });
  $(document).on('hidden.tui.layer', '.auto-generated-layer', function () {
    $(this).removeData(DATA_KEY);
    $(this).remove();
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Layer._jQueryInterface;
  $.fn[NAME].Constructor = Layer;

  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Layer._jQueryInterface;
  };

  return Layer;
}($);
//# sourceMappingURL=layer.js.map