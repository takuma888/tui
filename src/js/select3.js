import $ from 'jquery';
import Util from './util';

const Select3 = (($) => {
    const NAME                = 'select3';
    const VERSION             = '4.0.0';
    const DATA_KEY            = 'tui.select3';
    const EVENT_KEY           = `.${DATA_KEY}`;
    const DATA_API_KEY        = '.data-api';
    const JQUERY_NO_CONFLICT  = $.fn[NAME];


    const Default = {
        placeholder: '',
        search: false,
    };

    const DefaultType = {
        placeholder: 'string',
        search: 'boolean'
    };

    const Event = {
        // HIDE              : `hide${EVENT_KEY}`,
        // HIDDEN            : `hidden${EVENT_KEY}`,
        // SHOW              : `show${EVENT_KEY}`,
        CLICK_SHOW              : `click.show${EVENT_KEY}`,
        CLICK_SELECT            : `click.select${EVENT_KEY}`,
        CLICK_RESET             : `click.reset${EVENT_KEY}`,
        CLICK_REMOVE            : `click.remove${EVENT_KEY}`,
        // SHOWN             : `shown${EVENT_KEY}`,
        // LOADED            : `loaded${EVENT_KEY}`,
        // FOCUSIN           : `focusin${EVENT_KEY}`,
        // RESIZE            : `resize${EVENT_KEY}`,
        CLICK_DISMISS           : `click.dismiss${EVENT_KEY}`,
        // KEYDOWN_DISMISS   : `keydown.dismiss${EVENT_KEY}`,
        // MOUSEUP_DISMISS   : `mouseup.dismiss${EVENT_KEY}`,
        // MOUSEDOWN_DISMISS : `mousedown.dismiss${EVENT_KEY}`,
        // CLICK_DATA_API    : `click${EVENT_KEY}${DATA_API_KEY}`
    };

    const ClassName = {
        BACKDROP                : 'tui-select-backdrop',
        CONTAINER_ACTIVE        : 'tui-select-container-active',
        POPOUT                  : 'tui-select-popout',
        CONTAINER               : 'tui-select-container',
        // SCROLLBAR_MEASURER : 'layer-scrollbar-measure',
        // BACKDROP           : 'layer-backdrop',
        // FADE               : 'fade',
        // SHOW               : 'show',
        // LAYER              : 'layer-inner'
    };

    const Selector = {
        DATA_TOGGLE         : '[data-toggle="tui-select"]',
    };



    class Select3 {
        constructor(element, config) {
            this._config              = this._getConfig(config);
            this._element             = element;
            this._isShown             = false;
            this._allowClear          = !!this._config.placeholder;
            this._isMultiple          = $(element).prop('multiple');
        }

        // Public

        toggle() {
            // 绘制
            let $element = $(this._element);
            $element.addClass('d-none');
            let html = '';
            if (this._isMultiple) {
                html += '<div class="tui tui-select-container tui-select-container-multiple">';
            } else {
                html += '<div class="tui tui-select-container">'
            }

            if (this._isMultiple) {
                html += '<ul class="tui-select-choices list-unstyled d-flex mb-0">';

                // html += '<li class="tui-select-search-choice"><div>aaaaaaaaaaa</div><a href="javascript:void(0);" class="tui-select-search-choice-close" tabindex="-1">×</a></li>';

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

            const that = this;
            const $container = this._getContainer();
            $container.on(`${Event.CLICK_SHOW}`, function () {
                if (!that._isShown) {
                    that.show();
                } else {
                    that.hide();
                }
            });
            const $options = $('option:selected', this._element);

            if (this._isMultiple) {
                // 多选
                if ($options.length > 0) {
                    $options.each(function (i, d) {
                        const $option = $(d);
                        let text = $option.html();
                        const value = d.getAttribute('value');
                        let html = '<li class="tui-select-search-choice">' +
                            '<div>' + text + '</div>' +
                            '<a href="javascript:void(0);" data-value="' + value + '" class="tui-select-search-choice-close" tabindex="-1">×</a>' +
                            '</li>';
                        $container.find('.tui-select-choices > .tui-select-search-field').before(html);
                    });
                }
                $container.on(`${Event.CLICK_REMOVE}`, '.tui-select-search-choice-close', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const $this = $(this);
                    const value = $this.data('value');
                    $(this).parent().remove();
                    $('option:selected', that._element).each(function (i, d) {
                        const v = d.getAttribute('value');
                        if (v == value) {
                            $(d).prop('selected', false);
                        }
                    });
                });
            } else {
                // 单选
                let html = '&nbsp;';
                let isShowPlaceholder = false;
                if ($options.length > 0) {
                    const $option = $($options[0]);
                    html = $option.html();
                    if (html.length === 0 && this._config.placeholder) {
                        html = this._config.placeholder;
                        isShowPlaceholder = true;
                    }
                } else if (!this._config.placeholder) {
                    html = this._config.placeholder;
                    isShowPlaceholder = true;
                }
                if (isShowPlaceholder) {
                    $container.find('.tui-select-search-choice-close').removeClass('d-none').addClass('d-none');
                    $container.find('.tui-select-choice > span').removeClass('text-muted').addClass('text-muted');
                }

                $container.find('.tui-select-choice > span').html(html);

                $container.on(`${Event.CLICK_RESET}`, '.tui-select-search-choice-close', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $('option:selected', that._element).each(function (i, d) {
                        if (i === 0 && that._config.placeholder) {
                            $(d).prop('selected', true);
                        } else {
                            $(d).prop('selected', false);
                        }
                    });
                    $(this).removeClass('d-none').addClass('d-none');
                    let html = '&nbsp;';
                    if (that._config.placeholder) {
                        html = that._config.placeholder;
                    }
                    $container.find('.tui-select-choice > span').removeClass('text-muted').addClass('text-muted').html(html);
                });
            }



            this._drawBackdrop();
        }

        show() {
            if (this._isShown) {
                return;
            }
            const $options = $('option', this._element);
            const that = this;
            let $backdrop = this._drawBackdrop();
            $backdrop.on(`${Event.CLICK_DISMISS}`, function () {
                that.hide();
            });

            let $popout = this._drawPopout();

            this._isShown = true;
            $backdrop.toggleClass('d-none');
            $popout.toggleClass('d-none');

            let $container = this._getContainer();
            $container.toggleClass(`${ClassName.CONTAINER_ACTIVE}`);

            $popout.css({
                'width': $container.outerWidth() + 'px',
                'top': $container.offset().top + $container.outerHeight() + 'px',
                'left': $container.offset().left + 'px',
                'margin': 0,
                'margin-top': '1px',
            });
            if (!this._isMultiple) {
                $('.tui-select-search', $popout).find('.tui-input').focus();
            } else {
                $('.tui-select-search-field', $container).find('input').focus();
            }
            // 设置选项
            $options.each(function (i, d) {
                const $e = $(d);
                let text = $e.html();
                const value = d.getAttribute('value');
                let selected = $e.prop('selected');
                let disabled = $e.prop('disabled');
                if (that._config.placeholder && i === 0) {
                    disabled = true;
                    text = that._config.placeholder;
                    selected = false;
                }
                let html = '<li data-index="' + i + '" class="tui-select-item' + (disabled ? ' tui-select-item-disabled' : '') + (selected ? ' tui-select-item-selected' : '') + '">';
                html += '<div class="tui-select-item-label">';
                html += text;
                html += '</div>';
                html += '</li>';
                $popout.find('.tui-select-result').append(html);
            });
            $popout.off(`${Event.CLICK_SELECT}`)
                .on(`${Event.CLICK_SELECT}`, `.tui-select-item:not(.tui-select-item-disabled)`, function () {
                    const $e = $(this);
                    const index = $e.data('index');
                    const option = $('option', that._element)[index];
                    const $option = $(option);
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
                            const text = $option.html();
                            const value = option.getAttribute('value');
                            let html = '<li class="tui-select-search-choice">' +
                                '<div>' + text + '</div>' +
                                '<a href="javascript:void(0);" data-value="' + value + '" class="tui-select-search-choice-close" tabindex="-1">×</a>' +
                                '</li>';
                            $container.find('.tui-select-search-field').before(html);
                            that.hide();
                        }
                    }
                });
        }


        hide() {
            if (!this._isShown) {
                return;
            }

            let $popout = this._drawPopout();
            let $backdrop = this._drawBackdrop();

            this._isShown = false;
            $backdrop.toggleClass('d-none');
            $backdrop.off(`${Event.CLICK_DISMISS}`);
            $popout.toggleClass('d-none');

            let $container = this._getContainer();
            $container.toggleClass(`${ClassName.CONTAINER_ACTIVE}`);

            // 清空选项和搜索
            if (!this._isMultiple) {
                $('.tui-select-search', $popout).find('.tui-input').val('');
            } else {
                $('.tui-select-search-field', $container).find('input').val('');
            }
            $popout.find('.tui-select-result').empty();
        }

        dispose() {

        }

        // Private

        _selectItem() {

        }

        _getContainer() {
            let $element = $(this._element);
            return $element.parent().find(`.${ClassName.CONTAINER}`);
        }

        _drawPopout() {
            if ($(`.${ClassName.POPOUT}`, 'body').length === 0) {
                let html = '<div class="tui tui-select-popout d-none">';
                html += '<div class="tui-select-search p-1">';
                html += '<input type="text" autocomplete="off" class="tui-input">';
                html += '</div>';
                html += '<ul class="tui-select-result list-unstyled mb-0"></ul>';
                html += '</div>';
                $('body').append(html);
            }
            const $popout = $(`.${ClassName.POPOUT}`, 'body');
            $popout.find('.tui-select-search').removeClass('d-none');
            if (!this._config.search || this._isMultiple) {
                $popout.find('.tui-select-search').addClass('d-none');
            }
            return $(`.${ClassName.POPOUT}`, 'body');
        }

        _drawBackdrop() {
            if ($(`.${ClassName.BACKDROP}`, 'body').length === 0) {
                let html = '<div class="tui tui-select-backdrop d-none"></div>';
                $('body').append(html);
            }
            return $(`.${ClassName.BACKDROP}`, 'body');
        }

        _getConfig(config) {
            config = {
                ...Default,
                ...config
            };
            Util.typeCheckConfig(NAME, config, DefaultType);
            return config;
        }

        // Static

        static _jQueryInterface(config) {
            return this.each(function () {
                let data = $(this).data(DATA_KEY);
                const _config = {
                    ...Select3.Default,
                    ...$(this).data(),
                    ...typeof config === 'object' && config
                };

                if (!data) {
                    data = new Select3(this, _config);
                    $(this).data(DATA_KEY, data);
                }

                if (typeof config === 'string') {
                    if (typeof data[config] === 'undefined') {
                        throw new TypeError(`No method named "${config}"`);
                    }
                    data[config]();
                } else if (_config.toggle) {
                    data.toggle();
                }
            })
        }
    }

    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */

    $(document).ready(function () {
        $(Selector.DATA_TOGGLE).each(function () {
            let $target = $(this);

            const config = $target.data(DATA_KEY)
                ? 'toggle' : {
                    ...$target.data()
                };

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

})($);

export default Select3;