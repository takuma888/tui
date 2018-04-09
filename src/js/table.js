import $ from 'jquery';
import Util from './util';

const Table = (($) => {
    const NAME                = 'table';
    const VERSION             = '4.0.0';
    const DATA_KEY            = 'tui.table';
    const EVENT_KEY           = `.${DATA_KEY}`;
    const DATA_API_KEY        = '.data-api';
    const JQUERY_NO_CONFLICT  = $.fn[NAME];

    const Selector = {
        DATA_TOGGLE          : '[data-toggle="tui-table"]',
        PAGE_TOGGLE          : '[data-toggle="tui-table-page"]',
        SORT_TOGGLE          : '[data-toggle="tui-table-sort"]',
        FILTER_TOGGLE        : '[data-toggle="tui-table-filter"]',
    };

    const Default = {
        url          : '',
        page         : false,
        size         : false,
        total        : false,
        draw         : true,
        fields       : '',
        caption      : '',
        method       : 'get',
        pageTpl      : '翻页',
        pageNum      : 7,
        sort         : '',
        filter       : '',
    };

    const DefaultType = {
        url      : 'string',
        page     : '(boolean|number)',
        size     : '(boolean|number)',
        total    : '(boolean|number)',
        draw     : 'boolean',
        fields   : 'string',
        caption  : 'string',
        method   : 'string',
        pageTpl  : 'string',
        pageNum  : 'number',
        sort     : 'string',
        filter   : 'string',
    };

    const ClassName = {
        TABLE               : 'tui-table',
        ROW                 : 'tui-table-row',
        ROW_SELECTED        : 'tui-table-row-selected',
        TABLE_CELL          : 'tui-table-cell text-truncate',
        TABLE_CELL_FILTER   : 'tui-table-cell-filter',
        TABLE_FOOTER        : 'tui-table-footer',
        TABLE_HEADER        : 'tui-table-header',
        TABLE_SORT          : 'tui-table-sort',
        TABLE_SORT_DESC     : 'tui-table-sort-desc',
        TABLE_FILTER_TOGGLE : 'tui-table-filter-toggle',
        TABLE_FILTER        : 'tui-table-filter',
    };

    const Event = {
        CLICK_PAGE     : `click.page${EVENT_KEY}`,
        CLICK_SORT     : `click.sort${EVENT_KEY}`,
        CLICK_FILTER   : `click.filter${EVENT_KEY}`,
        CLICK_SELECT   : `click.select${EVENT_KEY}`,
    };

    class Table {
        constructor(container, element, config) {
            this._config                = this._getConfig(config);
            this._element               = element;
            this._isShown               = false;
            this._container             = container;
            this._rows                  = [];
            this._headers               = [];

            if (this._config.pageNum % 2 === 0) {
                this._config.pageNum += 1;
            }

            if (this._config['sort'].length > 0) {
                let sort = this._config['sort'].split('|');
                let sorts = {};
                $(sort).each(function (i, d) {
                    let sortValues = d.split(',');
                    sorts[sortValues[0]] = {
                        'key': sortValues[0],
                        'dir': sortValues[1] ? sortValues[1] : 'asc',
                    };
                });
                this._config['sort'] = sorts;
            }
            // 创建header
            let headerDiv = document.createElement('div');
            headerDiv.className = ClassName.TABLE_HEADER;
            $(this._container).prepend(headerDiv);
            $(`.${ClassName.TABLE_HEADER}`, this._container).append('<div class="tui-table-filter-wrapper"></div>');
            // 创建footer
            let footerDiv = document.createElement('div');
            footerDiv.className = ClassName.TABLE_FOOTER;
            this._container.appendChild(footerDiv);
            $(`.${ClassName.TABLE_FOOTER}`, this._container).append('<div class="tui-table-pagination"></div>');

            if (this._config.filter.length > 0) {
                let filter = this._config.filter.split('|');
                let filters = {};
                $(filter).each(function (i, d) {
                    filters[d] = {
                        'key': d,
                        'value': '',
                    };
                });
                this._config.filter = filters;
            }
            let that = this;

            // 选取
            $(this._container).on(Event.CLICK_SELECT, `.${ClassName.ROW}`, function () {
                $(`.${ClassName.ROW}`, that._container).removeClass(ClassName.ROW_SELECTED);
                $(this).addClass(ClassName.ROW_SELECTED);
            });

            // 分页
            $(this._container).on(Event.CLICK_PAGE, Selector.PAGE_TOGGLE, function () {
                that._config.page = $(this).data('page');
                that._getData(function () {
                    that._drawTableBody('page');
                    that._drawPage('page');
                });
            });
            // sort
            $(this._container).on(Event.CLICK_SORT, Selector.SORT_TOGGLE, function () {
                const sortKey = $(this).parent('th').data('key');
                that._config['sort'][sortKey]['dir'] = $(this).hasClass(ClassName.TABLE_SORT_DESC) ? 'asc' : 'desc';
                that._getData(function () {
                    that._drawTableBody('sort');
                    that._drawPage('sort');
                });
            });

            // filter
            $(this._container).on(Event.CLICK_FILTER, Selector.FILTER_TOGGLE, function () {
                const $target = $($(this).data('target'));
                $target.toggleClass('show');
            });
            $(this._container).on('input', '.tui-table-filter-input', function () {
                const $input = $(this);
                const key = this.getAttribute('name');
                that._config.filter[key].value = $input.val();
                that._getData(function () {
                    that._drawTableBody('filter');
                    that._drawPage('filter');
                });
            });
        }

        dispose() {
            this._config = null;
            this._element = null;
            this._container = null;
            this._isShown = null;
            this._headers = null;
            this._rows = null;
        }

        // Getters

        static get VERSION() {
            return VERSION;
        }

        static get Default() {
            return Default;
        }

        // Public


        toggle() {
            let that = this;
            this._getData(function () {
                that._drawTable('toggle');
                that._drawPage('toggle');
                that._isShown = true;
            });
        }

        // Private

        _drawPage(scope) {
            console.log('draw page when "' + scope + '"');
            let html = '';
            html += '<nav aria-label="Page navigation"><ul class="tui-table-pager">';
            if (this._config.total <= 0) {
                html += '<li>未查询到数据</li>';
                html += '</ul></nav>';
                $(`.${ClassName.TABLE_FOOTER}`, this._container).find('.tui-table-pagination').empty().html(html);
                return;
            }
            html += '<li>' + this._config.pageTpl + '</li>';
            html += '<li><a href="javascript:void(0);" data-toggle="tui-table-page" data-page="1" aria-label="Previous"><span aria-hidden="true">&laquo;</span><span class="sr-only">First</span></a></li>'
            let lastPage = Math.ceil(this._config.total / this._config.size);
            let currentPage = Math.min(Math.max(1, parseInt(this._config.page)), lastPage);
            let delta = (parseInt(this._config.pageNum) - 1) / 2;
            let left = 0;
            let right = 0;


            let currentPageHtml = '<li><a class="active" href="javascript:void(0);" data-toggle="tui-table-page" data-page="' + currentPage + '">' + currentPage + '</a></li>';

            let prevPage = parseInt(currentPage) - 1;
            let nextPage = parseInt(currentPage) + 1;

            let leftStop = false;
            let rightStop = false;

            // if (scope === 'filter') {
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
            html += '<li><a href="javascript:void(0);" data-toggle="tui-table-page" data-page="' + lastPage + '" aria-label="Previous"><span aria-hidden="true">&raquo;</span><span class="sr-only">Last</span></a></li>'
            html += '<li>共 ' + this._config.total + '</li>';
            html += '</ul></nav>';

            $(`.${ClassName.TABLE_FOOTER}`, this._container).find('.tui-table-pagination').empty().html(html);
        }

        _drawTable(scope) {
            console.log('draw table when "' + scope + '"');
            $(this._element).removeClass(ClassName.TABLE).addClass(ClassName.TABLE).empty();
            let html = '';
            // caption
            if (this._config.caption) {
                html += '<caption>' + this._config.caption + '</caption>';
            }
            html += '<thead></thead><tbody></tbody><tfoot></tfoot>';
            $(this._element).html(html);
            this._drawTableHeader(scope);
            this._drawTableBody(scope);
            this._drawTableFooter(scope);
        }

        _drawTableHeader(scope) {
            console.log('draw table header when "' + scope + '"');
            if (this._headers.length > 0) {
                let html = '';
                html += '<tr>';
                let that = this;
                $(this._headers).each(function (i, d) {
                    html += '<th data-key="' + d['key'] + '" title="' + d['name'] + '" style="' + d['style'] + '">';
                    html += '<div class="' + ClassName.TABLE_CELL + '">' + d['name'] + '</div>';

                    if (that._config.filter[d['key']]) {
                        const item = that._config.filter[d['key']];
                        html += '<div class="' + ClassName.TABLE_FILTER_TOGGLE + '" data-toggle="tui-table-filter" data-target="#filter-' + d['key'] + '">';
                        html += '</div>';
                        html += '<div class="tui-control tui-table-filter-control" id="filter-' + d['key'] + '"><input type="text" name="' + d['key'] + '" class="tui-input tui-table-filter-input" value="' + item['value'] + '"></div>';
                    }

                    if (that._config['sort'][d['key']]) {
                        const sortConfig = that._config['sort'][d['key']];
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
        }


        _drawTableBody(scope) {
            console.log('draw table body when "' + scope + '"');
            // rows
            let html = '';
            let that = this;
            $(this._rows).each(function (i, d) {
                let row = '<tr class="' + ClassName.ROW + ' ' + ClassName.ROW + '-' + i +'">';
                $(that._headers).each(function (j, h) {
                    let cell = d[j];
                    let cellClass = ClassName.TABLE_CELL;

                    if (that._config.filter[h['key']] && that._config.filter[h['key']]['value'] !== '') {
                        cellClass += ' ' + ClassName.TABLE_CELL_FILTER;
                    }
                    row += '<td title="' + cell + '"><div class="' + cellClass + '" style="' + h['style'] + '">' + cell + '</div></td>';
                });
                row += '</tr>';
                html += row;
            });
            $('tbody', this._element).empty().html(html);
        }


        _drawTableFooter(scope) {
            console.log('draw table footer when "' + scope + '"');
        }

        _getConfig(config) {
            config = {
                ...Default,
                ...config
            };
            Util.typeCheckConfig(NAME, config, DefaultType);
            return config;
        }


        _getData(callback) {
            if (!this._config.caption) {
                this._config.caption = $(this._element).find('caption').html();
            }
            let _headers = [];
            let _rows = [];
            if (this._config.url) {
                // 解析fields
                if (this._config.fields.length > 0) {
                    $(this._config.fields.split('|')).each(function (i, d) {
                        const col = d.split(',', 3);
                        _headers.push({
                            'key' : col[0],
                            'name': col[1],
                            'style':col[2] ? col[2] : ''
                        });
                    });
                }
                this._headers = _headers;

                let data = {};
                data.page = Math.max(1, this._config.page);
                if (this._isShown) {
                    data.sort = this._config.sort;
                    data.filter = this._config.filter;
                }
                let that = this;
                $.ajax({
                    url: this._config.url,
                    type: this._config.method,
                    data: data,
                    success: function (data) {
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
                        let rows = data['data'];
                        if (typeof rows === 'object') {
                            $(rows).each(function (i, d) {
                                let r = [];
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
                let cells = $(this._element).find('thead > tr > th, thead > tr > td');
                $(cells).each(function (i, d) {
                    const $e = $(d);
                    _headers.push({
                        'key': $e.data('key'),
                        'name': $e.html(),
                        'style': d.getAttribute('style')
                    });
                });
                this._headers = _headers;

                let rs = $(this._element).find('tbody > tr');
                $(rs).each(function (i, d) {
                    let r = [];
                    const cells = $(d).find('th, td');
                    $(cells).each(function (i, d) {
                        r.push($(d).html());
                    });
                    _rows.push(r);
                });
                this._rows = _rows;
                callback()
            }
        }



        // Static

        static _jQueryInterface(relatedTarget, config) {
            return this.each(function () {
                let data = $(this).data(DATA_KEY);
                const _config = {
                    ...Table.Default,
                    ...$(this).data(),
                    ...typeof config === 'object' && config
                };

                if (!data) {
                    data = new Table(relatedTarget, this, _config);
                    $(this).data(DATA_KEY, data);
                }

                if (typeof config === 'string') {
                    if (typeof data[config] === 'undefined') {
                        throw new TypeError(`No method named "${config}"`);
                    }
                    data[config](relatedTarget);
                } else if (_config.toggle) {
                    data.toggle(relatedTarget);
                }
            });
        }
    }


    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */
    $(document).ready(function () {
        let $element = $(Selector.DATA_TOGGLE);
        let target;
        const selector = Util.getSelectorFromElement($element[0]);

        if (selector) {
            target = $(selector)[0];
        }
        const config = $(target).data(DATA_KEY)
            ? 'toggle' : {
                ...$(target).data(),
                ...$element.data()
            };

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
})($);

export default Table;