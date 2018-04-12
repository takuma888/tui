function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Select3 = function ($) {
  var NAME = 'select3';
  var VERSION = '4.0.0';
  var DATA_KEY = 'tui.select3';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var Default = {
    placeholder: '',
    search: true
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
    } // Public


    var _proto = Select3.prototype;

    _proto.toggle = function toggle() {
      // 绘制
      var $element = $(this._element);
      $element.addClass('d-none');
      var html = '';
      html += '<div class="tui-select-container">';
      html += '<a href="javascript:void(0);" class="tui-select-choice" tabindex="-1">';
      html += '<span>&nbsp;</span>';

      if (this._allowClear) {
        html += '<abbr class="tui-select-search-choice-close" style="">×</abbr>';
      }

      html += '</a>';
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

      this._drawBackdrop();
    };

    _proto.show = function show() {
      if (this._isShown) {
        return;
      }

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
      $('.tui-select-search', $popout).find('.tui-input').focus();
    };

    _proto.hide = function hide() {
      if (!this._isShown) {
        return;
      }

      var $popout = this._drawPopout();

      var $backdrop = this._drawBackdrop();

      this._isShown = false;
      $backdrop.toggleClass('d-none');
      $popout.toggleClass('d-none');

      var $container = this._getContainer();

      $container.toggleClass("" + ClassName.CONTAINER_ACTIVE);
    };

    _proto.dispose = function dispose() {}; // Private


    _proto._getContainer = function _getContainer() {
      var $element = $(this._element);
      return $element.parent().find("." + ClassName.CONTAINER);
    };

    _proto._drawPopout = function _drawPopout() {
      if ($("." + ClassName.POPOUT, 'body').length === 0) {
        var html = '<div class="tui tui-select-popout d-none">';
        html += '<div class="tui-select-search p-1">';
        html += '<input type="text" autocomplete="off" class="tui-input">';
        html += '</div>';
        html += '<ul class="tui-select-result mb-0"></ul>';
        html += '</div>';
        $('body').append(html);
      }

      var $popout = $("." + ClassName.POPOUT, 'body');
      $popout.find('.tui-select-search').removeClass('d-none');

      if (!this._config.search) {
        $popout.find('.tui-select-search').addClass('d-none');
      }

      return $("." + ClassName.POPOUT, 'body');
    };

    _proto._drawBackdrop = function _drawBackdrop() {
      if ($("." + ClassName.BACKDROP, 'body').length === 0) {
        var html = '<div class="tui tui-select-backdrop d-none"></div>';
        $('body').append(html);
      }

      return $("." + ClassName.BACKDROP, 'body');
    };

    _proto._getConfig = function _getConfig(config) {
      config = _extends({}, Default, config);
      Util.typeCheckConfig(NAME, config, DefaultType);
      return config;
    }; // Static


    Select3._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY);

        var _config = _extends({}, Select3.Default, $(this).data(), typeof config === 'object' && config);

        if (!data) {
          data = new Select3(this, _config);
          $(this).data(DATA_KEY, data);
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


  $(document).ready(function () {
    $(Selector.DATA_TOGGLE).each(function () {
      var $target = $(this);
      var config = $target.data(DATA_KEY) ? 'toggle' : _extends({}, $target.data());

      Select3._jQueryInterface.call($target, config);
    });
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Select3._jQueryInterface;
  $.fn[NAME].Constructor = Select3;

  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Select3._jQueryInterface;
  };

  return Select3;
}($);
//# sourceMappingURL=select3.js.map