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
        search: true,
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
        }

        // Public

        toggle() {
            // 绘制
            let $element = $(this._element);
            $element.addClass('d-none');
            let html = '';
            html += '<div class="tui-select-container">';
            html += '<a href="javascript:void(0);" class="tui-select-choice" tabindex="-1">';
            html += '<span>&nbsp;</span>';
            if (this._allowClear) {
                html += '<abbr class="tui-select-search-choice-close" style="">×</abbr>';
            }
            html += '</a>';
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

            this._drawBackdrop();
        }

        show() {
            if (this._isShown) {
                return;
            }
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
            $('.tui-select-search', $popout).find('.tui-input').focus();
        }


        hide() {
            if (!this._isShown) {
                return;
            }

            let $popout = this._drawPopout();
            let $backdrop = this._drawBackdrop();

            this._isShown = false;
            $backdrop.toggleClass('d-none');
            $popout.toggleClass('d-none');

            let $container = this._getContainer();
            $container.toggleClass(`${ClassName.CONTAINER_ACTIVE}`);

        }

        dispose() {

        }

        // Private

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
                html += '<ul class="tui-select-result mb-0"></ul>';
                html += '</div>';

                $('body').append(html);
            }
            const $popout = $(`.${ClassName.POPOUT}`, 'body');
            $popout.find('.tui-select-search').removeClass('d-none');
            if (!this._config.search) {
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