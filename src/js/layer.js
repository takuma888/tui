import $ from 'jquery';
import Util from './util';

const Layer = (($) => {
    const NAME                = 'layer';
    const VERSION             = '4.0.0';
    const DATA_KEY            = 'tui.layer';
    const EVENT_KEY           = `.${DATA_KEY}`;
    const DATA_API_KEY        = '.data-api';
    const JQUERY_NO_CONFLICT  = $.fn[NAME];
    const ESCAPE_KEYCODE      = 27; // KeyboardEvent.which value for Escape (Esc) key

    let LAYER_ZINDEX       = 1050;
    let LAYER_COUNT        = 0;

    const Default = {
        offset   : 'auto',
        backdrop : true,
        keyboard : true,
        focus    : true,
        show     : true,
        width    : '',
        height   : '',
        type     : 'modal',
        url      : '',
        fixed    : true
    };

    const DefaultType = {
        offset   : '(number|string|function)',
        backdrop : '(boolean|string)',
        keyboard : 'boolean',
        focus    : 'boolean',
        show     : 'boolean',
        width    : '(number|string)',
        height   : '(number|string)',
        type     : 'string',
        url      : 'string',
        fixed    : 'boolean'
    };


    const Type = {
        modal: 'modal',
        iframe: 'iframe'
    };

    const Event = {
        HIDE              : `hide${EVENT_KEY}`,
        HIDDEN            : `hidden${EVENT_KEY}`,
        SHOW              : `show${EVENT_KEY}`,
        SHOWN             : `shown${EVENT_KEY}`,
        LOADED            : `loaded${EVENT_KEY}`,
        FOCUSIN           : `focusin${EVENT_KEY}`,
        RESIZE            : `resize${EVENT_KEY}`,
        CLICK_DISMISS     : `click.dismiss${EVENT_KEY}`,
        KEYDOWN_DISMISS   : `keydown.dismiss${EVENT_KEY}`,
        MOUSEUP_DISMISS   : `mouseup.dismiss${EVENT_KEY}`,
        MOUSEDOWN_DISMISS : `mousedown.dismiss${EVENT_KEY}`,
        CLICK_DATA_API    : `click${EVENT_KEY}${DATA_API_KEY}`
    };

    const ClassName = {
        SCROLLBAR_MEASURER : 'layer-scrollbar-measure',
        BACKDROP           : 'layer-backdrop',
        OPEN               : 'layer-open',
        FADE               : 'fade',
        SHOW               : 'show',
        LAYER              : 'layer-inner'
    };

    const Selector = {
        LAYER              : '.layer-inner',
        DATA_TOGGLE        : '[data-toggle="layer"]',
        DATA_DISMISS       : '[data-dismiss="layer"]',
        FIXED_CONTENT      : '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',
        STICKY_CONTENT     : '.sticky-top',
        NAVBAR_TOGGLER     : '.navbar-toggler'
    };

    class Layer {
        constructor(element, config) {
            this._id                  = ++ LAYER_COUNT;
            this._config              = this._getConfig(config);
            this._element             = element;
            this._layer               = $(element).find(Selector.LAYER)[0];
            this._backdrop            = null;
            this._isShown             = false;
            this._isBodyOverflowing   = false;
            this._scrollbarWidth      = 0;
        }

        // Getters

        static get VERSION() {
            return VERSION;
        }

        static get Default() {
            return Default;
        }

        // Public

        toggle(relatedTarget) {
            return this._isShown ? this.hide() : this.show(relatedTarget)
        }

        show(relatedTarget) {
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
                let loadFunction = function () {
                    const loadedEvent = $.Event(Event.LOADED, {
                        relatedTarget
                    });
                    $(this._element).trigger(loadedEvent);
                };
                if (this._config.type === Type.iframe) {
                    this._layer.src = this._config.url;
                    if (this._layer.attachEvent){
                        this._layer.attachEvent('onload', loadFunction);
                    } else {
                        this._layer.onload = loadFunction;
                    }
                    $(this._layer).appendTo(this._element);
                } else {
                    $(this._layer).appendTo(this._element);
                    $(this._layer)
                        .load(this._config.url, $.proxy(loadFunction, this))
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

            const showEvent = $.Event(Event.SHOW, {
                relatedTarget
            });

            $(this._element).trigger(showEvent);

            if (this._isShown || showEvent.isDefaultPrevented()) {
                return;
            }

            this._isShown = true;

            this._checkScrollbar();
            this._setScrollbar();

            $(this._element)
                .addClass(ClassName.SHOW)
                .css({
                    'z-index': LAYER_ZINDEX + LAYER_COUNT
                });
            if (this._config.width) {
                $(this._element).css({
                    'width': this._config.width,
                });
                $(this._layer).css({
                    'height': this._config.height
                });
            }
            if (this._config.height) {
                $(this._element).css({
                    'height': this._config.height,
                });
                $(this._layer).css({
                    'height': this._config.height
                });
            }

            if (this._config.fixed) {
                $(document.body).addClass(ClassName.OPEN);
            }

            this._adjustLayer();


            this._setEscapeEvent();
            this._setResizeEvent();

            $(this._element).on(
                Event.CLICK_DISMISS,
                Selector.DATA_DISMISS,
                (event) => this.hide(event)
            );

            this._showBackdrop(() => this._showElement(relatedTarget));
        }

        hide(event) {

            if (event) {
                event.preventDefault();
            }

            if (this._isTransitioning || !this._isShown) {
                return;
            }

            const hideEvent = $.Event(Event.HIDE);

            $(this._element).trigger(hideEvent);

            if (!this._isShown || hideEvent.isDefaultPrevented()) {
                return;
            }

            this._isShown = false;
            const transition = $(this._element).hasClass(ClassName.FADE);

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
                const transitionDuration  = Util.getTransitionDurationFromElement(this._element);

                $(this._element)
                    .one(Util.TRANSITION_END, (event) => this._hideLayer(event))
                    .emulateTransitionEnd(transitionDuration);
            } else {
                this._hideLayer();
            }
        }

        dispose() {
            $.removeData(this._element, DATA_KEY);

            $(window, document, this._element, this._backdrop).off(EVENT_KEY);
            this._config              = null;
            this._layer               = null;
            this._element             = null;
            this._backdrop            = null;
            this._isShown             = null;
            this._isBodyOverflowing   = null;
            this._scrollbarWidth      = null;
        }


        update() {
            this._adjustLayer();
        }


        // Private

        _getConfig(config) {
            config = {
                ...Default,
                ...config
            };
            Util.typeCheckConfig(NAME, config, DefaultType);
            return config;
        }

        _getPlacement() {
            let $window = $(window);
            let $element = $(this._element);
            let outerHeight = $element.outerHeight();
            let outerWidth = $element.outerWidth();
            let offsetTop = ($window.height() - outerHeight)/2;
            let offsetLeft = ($window.width() - outerWidth)/2;

            if (this._config.offset !== 'auto') {
                if(this._config.offset === 't'){ //上
                    offsetTop = 0;
                } else if(this._config.offset === 'r'){ //右
                    offsetLeft = $window.width() - outerWidth;
                } else if(this._config.offset === 'b'){ //下
                    offsetTop = $window.height() - outerHeight;
                } else if(this._config.offset === 'l'){ //左
                    offsetLeft = 0;
                } else if(this._config.offset === 'lt'){ //左上角
                    offsetTop = 0;
                    offsetLeft = 0;
                } else if(this._config.offset === 'lb'){ //左下角
                    offsetTop = $window.height() - outerHeight;
                    offsetLeft = 0;
                } else if(this._config.offset === 'rt'){ //右上角
                    offsetTop = 0;
                    offsetLeft = $window.width() - outerWidth;
                } else if(this._config.offset === 'rb'){ //右下角
                    offsetTop = $window.height() - outerHeight;
                    offsetLeft = $window.width() - outerWidth;
                } else {
                    offsetTop = this._config.offset;
                }
            }
            $element.css({top: offsetTop, left: offsetLeft});
        }

        _showElement(relatedTarget) {
            const transition = $(this._element).hasClass(ClassName.FADE);

            if (!this._element.parentNode ||
                this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
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

            const shownEvent = $.Event(Event.SHOWN, {
                relatedTarget
            });

            const transitionComplete = () => {
                if (this._config.focus) {
                    this._element.focus();
                }
                this._isTransitioning = false;
                $(this._element).trigger(shownEvent);
            };

            if (transition) {
                const transitionDuration  = Util.getTransitionDurationFromElement(this._element);

                $(this._element)
                    .one(Util.TRANSITION_END, transitionComplete)
                    .emulateTransitionEnd(transitionDuration);
            } else {
                transitionComplete();
            }
        }

        _enforceFocus() {
            $(document)
                .off(Event.FOCUSIN) // Guard against infinite focus loop
                .on(Event.FOCUSIN, (event) => {
                    if (document !== event.target &&
                        this._element !== event.target &&
                        $(this._element).has(event.target).length === 0) {
                        this._element.focus();
                    }
                });
        }

        _setEscapeEvent() {
            if (this._isShown && this._config.keyboard) {
                $(this._element).on(Event.KEYDOWN_DISMISS, (event) => {
                    if (event.which === ESCAPE_KEYCODE) {
                        event.preventDefault();
                        this.hide();
                    }
                });
            } else if (!this._isShown) {
                $(this._element).off(Event.KEYDOWN_DISMISS);
            }
        }

        _setResizeEvent() {
            if (this._isShown) {
                $(window).on(Event.RESIZE, (event) => this.update(event));
            } else {
                $(window).off(Event.RESIZE);
            }
        }

        _hideLayer() {
            this._element.style.display = 'none';
            this._element.setAttribute('aria-hidden', true);
            this._isTransitioning = false;
            this._showBackdrop(() => {
                if (this._config.fixed) {
                    $(document.body).removeClass(ClassName.OPEN);
                }
                this._resetAdjustments();
                this._resetScrollbar();
                $(this._element).trigger(Event.HIDDEN);
            });
        }

        _removeBackdrop() {
            if (this._backdrop) {
                $(this._backdrop).remove();
                this._backdrop = null;
            }
        }

        _showBackdrop(callback) {
            const animate = $(this._element).hasClass(ClassName.FADE)
                ? ClassName.FADE : '';

            if (this._isShown && this._config.backdrop) {
                this._backdrop = document.createElement('div');
                this._backdrop.className = ClassName.BACKDROP;

                if (animate) {
                    $(this._backdrop).addClass(animate);
                }

                $(this._backdrop).appendTo(document.body).addClass('tui');

                $(this._backdrop).on(Event.CLICK_DISMISS, (event) => {
                    if (event.target !== event.currentTarget) {
                        return;
                    }
                    if (this._config.backdrop === 'static') {
                        this._element.focus();
                    } else {
                        this.hide();
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

                const backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);

                $(this._backdrop)
                    .one(Util.TRANSITION_END, callback)
                    .emulateTransitionEnd(backdropTransitionDuration);
            } else if (!this._isShown && this._backdrop) {
                $(this._backdrop).removeClass(ClassName.SHOW);

                const callbackRemove = () => {
                    this._removeBackdrop();
                    if (callback) {
                        callback();
                    }
                };

                if ($(this._element).hasClass(ClassName.FADE)) {
                    const backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);

                    $(this._backdrop)
                        .one(Util.TRANSITION_END, callbackRemove)
                        .emulateTransitionEnd(backdropTransitionDuration);
                } else {
                    callbackRemove();
                }
            } else if (callback) {
                callback();
            }
        }

        // ----------------------------------------------------------------------
        // the following methods are used to handle overflowing modals
        // todo (fat): these should probably be refactored out of modal.js
        // ----------------------------------------------------------------------

        _adjustLayer() {
            const isModalOverflowing =
                this._element.scrollHeight > document.documentElement.clientHeight;

            if (!this._isBodyOverflowing && isModalOverflowing) {
                this._element.style.paddingLeft = `${this._scrollbarWidth}px`;
            }

            if (this._isBodyOverflowing && !isModalOverflowing) {
                this._element.style.paddingRight = `${this._scrollbarWidth}px`;
            }

            this._getPlacement();
        }

        _resetAdjustments() {
            this._element.style.paddingLeft = '';
            this._element.style.paddingRight = '';
        }

        _checkScrollbar() {
            const rect = document.body.getBoundingClientRect();
            this._isBodyOverflowing = rect.left + rect.right < window.innerWidth;
            this._scrollbarWidth = this._getScrollbarWidth();
        }

        _setScrollbar() {
            if (this._isBodyOverflowing) {
                // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
                //   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set

                // Adjust fixed content padding
                $(Selector.FIXED_CONTENT).each((index, element) => {
                    const actualPadding = $(element)[0].style.paddingRight;
                    const calculatedPadding = $(element).css('padding-right');
                    $(element).data('padding-right', actualPadding).css('padding-right', `${parseFloat(calculatedPadding) + this._scrollbarWidth}px`);
                });

                // Adjust sticky content margin
                $(Selector.STICKY_CONTENT).each((index, element) => {
                    const actualMargin = $(element)[0].style.marginRight;
                    const calculatedMargin = $(element).css('margin-right');
                    $(element).data('margin-right', actualMargin).css('margin-right', `${parseFloat(calculatedMargin) - this._scrollbarWidth}px`);
                });

                // Adjust navbar-toggler margin
                $(Selector.NAVBAR_TOGGLER).each((index, element) => {
                    const actualMargin = $(element)[0].style.marginRight;
                    const calculatedMargin = $(element).css('margin-right');
                    $(element).data('margin-right', actualMargin).css('margin-right', `${parseFloat(calculatedMargin) + this._scrollbarWidth}px`);
                });

                // Adjust body padding
                const actualPadding = document.body.style.paddingRight;
                const calculatedPadding = $(document.body).css('padding-right');
                $(document.body).data('padding-right', actualPadding).css('padding-right', `${parseFloat(calculatedPadding) + this._scrollbarWidth}px`);
            }
        }

        _resetScrollbar() {
            // Restore fixed content padding
            $(Selector.FIXED_CONTENT).each((index, element) => {
                const padding = $(element).data('padding-right');
                if (typeof padding !== 'undefined') {
                    $(element).css('padding-right', padding).removeData('padding-right');
                }
            });

            // Restore sticky content and navbar-toggler margin
            $(`${Selector.STICKY_CONTENT}, ${Selector.NAVBAR_TOGGLER}`).each((index, element) => {
                const margin = $(element).data('margin-right');
                if (typeof margin !== 'undefined') {
                    $(element).css('margin-right', margin).removeData('margin-right');
                }
            });

            // Restore body padding
            const padding = $(document.body).data('padding-right');
            if (typeof padding !== 'undefined') {
                $(document.body).css('padding-right', padding).removeData('padding-right');
            }
        }

        _getScrollbarWidth() { // thx d.walsh
            const scrollDiv = document.createElement('div');
            scrollDiv.className = ClassName.SCROLLBAR_MEASURER;
            document.body.appendChild(scrollDiv);
            const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
            document.body.removeChild(scrollDiv);
            return scrollbarWidth;
        }


        // Static

        static _jQueryInterface(config, relatedTarget) {
            return this.each(function () {
                let data = $(this).data(DATA_KEY);
                const _config = {
                    ...Layer.Default,
                    ...$(this).data(),
                    ...typeof config === 'object' && config
                };

                if (!data) {
                    data = new Layer(this, _config);
                    $(this).data(DATA_KEY, data);
                }

                if (typeof config === 'string') {
                    if (typeof data[config] === 'undefined') {
                        throw new TypeError(`No method named "${config}"`);
                    }
                    data[config](relatedTarget);
                } else if (_config.show) {
                    data.show(relatedTarget);
                }
            })
        }
    }



    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */

    $(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
        let target;
        const selector = Util.getSelectorFromElement(this);

        if (selector) {
            target = $(selector)[0];
        }
        if (!target) {
            target = document.createElement('div');
            target.className = 'layer';
            $(target)
                .appendTo(document.body)
                .addClass('tui')
                .addClass('auto-generated-layer');
        }

        const config = $(target).data(DATA_KEY)
            ? 'toggle' : {
                ...$(target).data(),
                ...$(this).data()
            };

        if (this.tagName === 'A' || this.tagName === 'AREA') {
            event.preventDefault();
        }

        const $target = $(target).one(Event.SHOW, (showEvent) => {
            if (showEvent.isDefaultPrevented()) {
                // Only register focus restorer if layer will actually get shown
                return;
            }

            $target.one(Event.HIDDEN, () => {
                if ($(this).is(':visible')) {
                    this.focus();
                }
            })
        });

        Layer._jQueryInterface.call($(target), config, this);
    });

    // remove ajax content and remove cache on modal closed
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
})($);

export default Layer;