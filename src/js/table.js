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
    };

    const ClassName = {
        TABLE        : 'tui-table',
        ROW          : 'tui-table-row',
        ROW_SELECTED : 'tui-table-row-selected',
        TABLE_CELL   : 'tui-table-cell text-truncate',
        TABLE_FOOTER : 'tui-table-footer',
    };

    const Event = {
        CLICK_PAGE     : `click.page${EVENT_KEY}`,
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

            let that = this;

            // 创建footer
            let footerDiv = document.createElement('div');
            footerDiv.className = ClassName.TABLE_FOOTER;
            this._container.appendChild(footerDiv);
            // 分页
            $(this._container).on(Event.CLICK_PAGE, Selector.PAGE_TOGGLE, function () {
                that._config.page = $(this).data('page');
                that._getData(function () {
                    that._drawBody();
                    that._drawPage();
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
                that._drawBody();
                that._drawPage();
            });
        }


        // Private

        _drawPage() {
            let html = '';
            html += '<div class="tui-table-pagination"><nav aria-label="Page navigation"><ul class="tui-table-pager">';
            html += '<li>' + this._config.pageTpl + '</li>';
            html += '<li><a href="javascript:void(0);" data-toggle="tui-table-page" data-page="1" aria-label="Previous"><span aria-hidden="true">&laquo;</span><span class="sr-only">First</span></a></li>'
            let lastPage = Math.ceil(this._config.total / this._config.size);
            let currentPage = parseInt(this._config.page);
            let delta = (parseInt(this._config.pageNum) - 1) / 2;
            let left = 0;
            let right = 0;


            let currentPageHtml = '<li><a class="active" href="javascript:void(0);" data-toggle="tui-table-page" data-page="' + currentPage + '">' + currentPage + '</a></li>';

            let prevPage = parseInt(currentPage) - 1;
            let nextPage = parseInt(currentPage) + 1;

            let leftStop = false;
            let rightStop = false;

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
            html += '<li><a href="javascript:void(0);" data-toggle="tui-table-page" data-page="' + lastPage + '" aria-label="Previous"><span aria-hidden="true">&raquo;</span><span class="sr-only">Last</span></a></li>'
            html += '</ul></nav></div>';

            $(this._container).find(`.${ClassName.TABLE_FOOTER}`).empty().html(html);
        }

        _drawBody() {
            $(this._element).removeClass(ClassName.TABLE).addClass(ClassName.TABLE).empty();
            let html = '';
            // caption
            if (this._config.caption) {
                html += '<caption>' + this._config.caption + '</caption>';
            }
            // thead
            if (this._headers.length > 0) {
                html += '<thead><tr>';
                $(this._headers).each(function (i, d) {
                    html += '<th title="' + d['name'] + '" style="' + d['style'] + '"><div class="' + ClassName.TABLE_CELL + '">' + d['name'] + '</div></th>'
                });
                html += '</tr></thead>'
            }
            // rows
            if (this._rows.length > 0) {
                html += '<tbody>';
                let that = this;
                $(this._rows).each(function (i, d) {
                    let row = '<tr class="' + ClassName.ROW + ' ' + ClassName.ROW + '-' + i +'">';
                    $(that._headers).each(function (j, h) {
                        let cell = d[j];
                        row += '<td title="' + cell + '" style="' + h['style'] + '"><div class="' + ClassName.TABLE_CELL + '" >' + cell + '</div></td>';
                    });
                    row += '</tr>';
                    html += row;
                });
                html += '</tbody>';
            }

            $(this._element).html(html);
            $(document).on('click', `.${ClassName.ROW}`, function () {
                $('.tui-table-row').removeClass(ClassName.ROW_SELECTED);
                $(this).addClass(ClassName.ROW_SELECTED);
            });
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

                let that = this;
                $.ajax({
                    url: this._config.url,
                    type: this._config.method,
                    data: {
                        page: Math.max(1, this._config.page)
                    },
                    success: function (data) {
                        that._rows = [];
                        that._config.page = data['page'];
                        that._config.size = data['size'];
                        that._config.total = data['total'];
                        let rows = data['data'];
                        $(rows).each(function (i, d) {
                            let r = [];
                            $(that._headers).each(function (i, p) {
                                r.push(d[p['key']]);
                            });
                            that._rows.push(r);
                        });
                        callback.call(that);
                    }
                });
            } else {
                let cells = $(this._element).find('thead > tr > th, thead > tr > td');
                $(cells).each(function (i, d) {
                    const $e = $(d);
                    _headers.push({
                        'name': $e.html()
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