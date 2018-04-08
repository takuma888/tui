function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Table = function ($) {
  var NAME = 'table';
  var VERSION = '4.0.0';
  var DATA_KEY = 'tui.table';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var Selector = {
    DATA_TOGGLE: '[data-toggle="tui-table"]',
    PAGE_TOGGLE: '[data-toggle="tui-table-page"]'
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
    pageNum: 7
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
    pageNum: 'number'
  };
  var ClassName = {
    TABLE: 'tui-table',
    ROW: 'tui-table-row',
    ROW_SELECTED: 'tui-table-row-selected',
    TABLE_CELL: 'tui-table-cell text-truncate',
    TABLE_FOOTER: 'tui-table-footer'
  };
  var Event = {
    CLICK_PAGE: "click.page" + EVENT_KEY
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

      if (this._config.pageNum % 2 === 0) {
        this._config.pageNum += 1;
      }

      var that = this; // 创建footer

      var footerDiv = document.createElement('div');
      footerDiv.className = ClassName.TABLE_FOOTER;

      this._container.appendChild(footerDiv); // 分页


      $(this._container).on(Event.CLICK_PAGE, Selector.PAGE_TOGGLE, function () {
        that._config.page = $(this).data('page');

        that._getData(function () {
          that._drawBody();

          that._drawPage();
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
        that._drawBody();

        that._drawPage();
      });
    }; // Private


    _proto._drawPage = function _drawPage() {
      var html = '';
      html += '<div class="tui-table-pagination"><nav aria-label="Page navigation"><ul class="tui-table-pager">';
      html += '<li>' + this._config.pageTpl + '</li>';
      html += '<li><a href="javascript:void(0);" data-toggle="tui-table-page" data-page="1" aria-label="Previous"><span aria-hidden="true">&laquo;</span><span class="sr-only">First</span></a></li>';
      var lastPage = Math.ceil(this._config.total / this._config.size);
      var currentPage = parseInt(this._config.page);
      var delta = (parseInt(this._config.pageNum) - 1) / 2;
      var left = 0;
      var right = 0;
      var currentPageHtml = '<li><a class="active" href="javascript:void(0);" data-toggle="tui-table-page" data-page="' + currentPage + '">' + currentPage + '</a></li>';
      var prevPage = parseInt(currentPage) - 1;
      var nextPage = parseInt(currentPage) + 1;
      var leftStop = false;
      var rightStop = false;

      while (left < delta && right < delta) {
        console.log('left:' + left, 'prevPage:' + prevPage);

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
      }

      if (prevPage > 0) {
        currentPageHtml = '<li><a href="javascript:void(0);" data-toggle="tui-table-page" data-page="' + (currentPage - 1) + '">...</a></li>' + currentPageHtml;
      }

      if (nextPage <= lastPage) {
        currentPageHtml += '<li><a href="javascript:void(0);" data-toggle="tui-table-page" data-page="' + (currentPage + 1) + '">...</a></li>';
      }

      html += currentPageHtml;
      html += '<li><a href="javascript:void(0);" data-toggle="tui-table-page" data-page="' + lastPage + '" aria-label="Previous"><span aria-hidden="true">&raquo;</span><span class="sr-only">Last</span></a></li>';
      html += '</ul></nav></div>';
      $(this._container).find("." + ClassName.TABLE_FOOTER).empty().html(html);
    };

    _proto._drawBody = function _drawBody() {
      $(this._element).removeClass(ClassName.TABLE).addClass(ClassName.TABLE).empty();
      var html = ''; // caption

      if (this._config.caption) {
        html += '<caption>' + this._config.caption + '</caption>';
      } // thead


      if (this._headers.length > 0) {
        html += '<thead><tr>';
        $(this._headers).each(function (i, d) {
          html += '<th title="' + d['name'] + '" style="' + d['style'] + '"><div class="' + ClassName.TABLE_CELL + '">' + d['name'] + '</div></th>';
        });
        html += '</tr></thead>';
      } // rows


      if (this._rows.length > 0) {
        html += '<tbody>';
        var that = this;
        $(this._rows).each(function (i, d) {
          var row = '<tr class="' + ClassName.ROW + ' ' + ClassName.ROW + '-' + i + '">';
          $(that._headers).each(function (j, h) {
            var cell = d[j];
            row += '<td title="' + cell + '" style="' + h['style'] + '"><div class="' + ClassName.TABLE_CELL + '" >' + cell + '</div></td>';
          });
          row += '</tr>';
          html += row;
        });
        html += '</tbody>';
      }

      $(this._element).html(html);
      $(document).on('click', "." + ClassName.ROW, function () {
        $('.tui-table-row').removeClass(ClassName.ROW_SELECTED);
        $(this).addClass(ClassName.ROW_SELECTED);
      });
    };

    _proto._getConfig = function _getConfig(config) {
      config = _extends({}, Default, config);
      Util.typeCheckConfig(NAME, config, DefaultType);
      return config;
    };

    _proto._getData = function _getData(callback) {
      if (!this._config.caption) {
        this._config.caption = $(this._element).find('caption').html();
      }

      var _headers = [];
      var _rows = [];

      if (this._config.url) {
        // 解析fields
        if (this._config.fields.length > 0) {
          $(this._config.fields.split('|')).each(function (i, d) {
            var col = d.split(',', 3);

            _headers.push({
              'key': col[0],
              'name': col[1],
              'style': col[2] ? col[2] : ''
            });
          });
        }

        this._headers = _headers;
        var that = this;
        $.ajax({
          url: this._config.url,
          type: this._config.method,
          data: {
            page: Math.max(1, this._config.page)
          },
          success: function success(data) {
            that._rows = [];
            that._config.page = data['page'];
            that._config.size = data['size'];
            that._config.total = data['total'];
            var rows = data['data'];
            $(rows).each(function (i, d) {
              var r = [];
              $(that._headers).each(function (i, p) {
                r.push(d[p['key']]);
              });

              that._rows.push(r);
            });
            callback.call(that);
          }
        });
      } else {
        var cells = $(this._element).find('thead > tr > th, thead > tr > td');
        $(cells).each(function (i, d) {
          var $e = $(d);

          _headers.push({
            'name': $e.html()
          });
        });
        this._headers = _headers;
        var rs = $(this._element).find('tbody > tr');
        $(rs).each(function (i, d) {
          var r = [];
          var cells = $(d).find('th, td');
          $(cells).each(function (i, d) {
            r.push($(d).html());
          });

          _rows.push(r);
        });
        this._rows = _rows;
        callback();
      }
    }; // Static


    Table._jQueryInterface = function _jQueryInterface(relatedTarget, config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY);

        var _config = _extends({}, Table.Default, $(this).data(), typeof config === 'object' && config);

        if (!data) {
          data = new Table(relatedTarget, this, _config);
          $(this).data(DATA_KEY, data);
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


  $(document).ready(function () {
    var $element = $(Selector.DATA_TOGGLE);
    var target;
    var selector = Util.getSelectorFromElement($element[0]);

    if (selector) {
      target = $(selector)[0];
    }

    var config = $(target).data(DATA_KEY) ? 'toggle' : _extends({}, $(target).data(), $element.data());

    Table._jQueryInterface.call($(target), $element[0], config);
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Table._jQueryInterface;
  $.fn[NAME].Constructor = Table;

  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Table._jQueryInterface;
  };

  return Table;
}($);
//# sourceMappingURL=table.js.map