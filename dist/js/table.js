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
        $(sort).each(function (i, d) {
          var sortValues = d.split(',');
          sorts[sortValues[0]] = {
            'key': sortValues[0],
            'dir': sortValues[1] ? sortValues[1] : 'asc'
          };
        });
        this._config['sort'] = sorts;
      } // 创建header


      if ($("." + ClassName.TABLE_HEADER, this._container).length === 0) {
        var headerDiv = document.createElement('div');
        headerDiv.className = ClassName.TABLE_HEADER;
        $(this._container).prepend(headerDiv);
      } // 创建footer


      if ($("." + ClassName.TABLE_FOOTER, this._container).length === 0) {
        var footerDiv = document.createElement('div');
        footerDiv.className = ClassName.TABLE_FOOTER;

        this._container.appendChild(footerDiv);
      }

      if ($("." + ClassName.TABLE_FOOTER, this._container).find('.tui-table-pagination').length === 0) {
        $("." + ClassName.TABLE_FOOTER, this._container).prepend('<div class="tui-table-pagination"></div>');
      }

      if (this._config.filter.length > 0) {
        var filter = this._config.filter.split('|');

        var filters = {};
        $(filter).each(function (i, d) {
          filters[d] = {
            'key': d,
            'value': ''
          };
        });
        this._config.filter = filters;
      }

      var that = this; // 选取

      $(this._container).on(Event.CLICK_SELECT, "." + ClassName.ROW, function () {
        $("." + ClassName.ROW, that._container).removeClass(ClassName.ROW_SELECTED);
        $(this).addClass(ClassName.ROW_SELECTED);
      }); // 分页

      $(this._container).on(Event.CLICK_PAGE, Selector.PAGE_TOGGLE, function () {
        that._config.page = $(this).data('page');

        that._getData(function () {
          that._drawTableBody('page');

          that._drawPage('page');
        });
      }); // sort

      $(this._container).on(Event.CLICK_SORT, Selector.SORT_TOGGLE, function () {
        var sortKey = $(this).parent('th').data('key');
        that._config['sort'][sortKey]['dir'] = $(this).hasClass(ClassName.TABLE_SORT_DESC) ? 'asc' : 'desc';
        that._sorted = true;

        that._getData(function () {
          that._drawTableBody('sort');

          that._drawPage('sort');

          that._drawSort('sort');
        });
      }); // filter

      $(this._container).on(Event.CLICK_FILTER, Selector.FILTER_TOGGLE, function () {
        var $target = $($(this).data('target'));
        $target.toggleClass('show');
      });
      $(this._container).on('input', '.tui-table-filter-input', function () {
        var $input = $(this);
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
      $(this._headers).each(function (i, d) {
        if (that._config['sort'][d['key']]) {
          var sortConfig = that._config['sort'][d['key']];
          var $sortDiv = $('thead th[data-key="' + d['key'] + '"]', that._element).find(Selector.SORT_TOGGLE);
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
        $("." + ClassName.TABLE_FOOTER, this._container).find('.tui-table-pagination').empty().html(html);
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
      $("." + ClassName.TABLE_FOOTER, this._container).find('.tui-table-pagination').empty().html(html);
    };

    _proto._drawTable = function _drawTable(scope) {
      console.log('draw table when "' + scope + '"');
      $(this._element).removeClass(ClassName.TABLE).addClass(ClassName.TABLE).empty();
      var html = ''; // caption

      if (this._config.caption) {
        html += '<caption>' + this._config.caption + '</caption>';
      }

      html += '<thead></thead><tbody></tbody><tfoot></tfoot>';
      $(this._element).html(html);

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
        $(this._headers).each(function (i, d) {
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
        $('thead', this._element).empty().html(html);
      }
    };

    _proto._drawTableBody = function _drawTableBody(scope) {
      console.log('draw table body when "' + scope + '"'); // rows

      var html = '';
      var that = this;
      $(this._rows).each(function (i, d) {
        var row = '<tr class="' + ClassName.ROW + ' ' + ClassName.ROW + '-' + i + '">';
        $(that._headers).each(function (j, h) {
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
      $('tbody', this._element).empty().html(html);
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
        var data = {};
        data.page = Math.max(1, this._config.page);

        if (this._isShown) {
          data.filter = this._config.filter;

          if (this._sorted) {
            data.sort = this._config.sort;
          }
        }

        var that = this;
        $.ajax({
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
              $(rows).each(function (i, d) {
                var r = [];
                $(that._headers).each(function (i, p) {
                  r.push(d[p['key']]);
                });

                that._rows.push(r);
              });
              callback.call(that);
            }
          }
        });
      } else {
        var cells = $(this._element).find('thead > tr > th, thead > tr > td');
        $(cells).each(function (i, d) {
          var $e = $(d);

          _headers.push({
            'key': $e.data('key'),
            'name': $e.html(),
            'style': d.getAttribute('style')
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

    if ($element.length) {
      var target;
      var selector = Util.getSelectorFromElement($element[0]);

      if (selector) {
        target = $(selector)[0];
      }

      var config = $(target).data(DATA_KEY) ? 'toggle' : _extends({}, $(target).data(), $element.data());

      Table._jQueryInterface.call($(target), $element[0], config);
    }
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