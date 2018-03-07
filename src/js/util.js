import $ from 'jquery';


const Util = (($) => {
    let transition = false;

    const MAX_UID = 1000000;

    function toType() {
        return {
            bindType: transition.end,
            delegateType: transition.end,
            handle(event) {
                if ($(event.target).is(this)) {
                    return event.handleObj.handler.apply(this, arguments);
                }
                return undefined;
            }
        }
    }

    function getSpecialTransitionEndEvent() {
        return {
            bindType: transition.end,
            delegateType: transition.end,
            handle(event) {
                if ($(event.target).is(this)) {
                    return event.handleObj.handler.apply(this, arguments);
                }
                return undefined;
            }
        }
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
        let called = false;

        $(this).one(Util.TRANSITION_END, () => {
            called = true;
        });

        setTimeout(() => {
            if (!called) {
                Util.triggerTransitionEnd(this);
            }
        }, duration);

        return this;
    }

    function setTransitionEndSupport() {
        transition = transitionEndTest();

        $.fn.emulateTransitionEnd = transitionEndEmulator;

        if (Util.supportsTransitionEnd()) {
            $.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
        }
    }

    const Util = {

        TRANSITION_END: 'tuiTransitionEnd',

        getUID(prefix) {
            do {
                prefix += ~~(Math.random() * MAX_UID);
            } while (document.getElementById(prefix));
            return prefix;
        },

        getSelectorFromElement(element) {
            let selector = element.getAttribute('data-target');
            if (!selector || selector === '#') {
                selector = element.getAttribute('href') || '';
            }

            try {
                const $selector = $(document).find(selector);
                return $selector.length > 0 ? selector : null;
            } catch (err) {
                return null;
            }
        },

        reflow(element) {
            return element.offsetHeight;
        },

        triggerTransitionEnd(element) {
            $(element).trigger(transition.end);
        },

        supportsTransitionEnd() {
            return Boolean(transition);
        },

        isElement(obj) {
            return (obj[0] || obj).nodeType;
        },

        typeCheckConfig(componentName, config, configTypes) {
            for (const property in configTypes) {
                if (Object.prototype.hasOwnProperty.call(configTypes, property)) {
                    const expectedTypes = configTypes[property];
                    const value         = config[property];
                    const valueType     = value && Util.isElement(value)
                        ? 'element' : toType(value);

                    if (!new RegExp(expectedTypes).test(valueType)) {
                        throw new Error(
                            `${componentName.toUpperCase()}: ` +
                            `Option "${property}" provided type "${valueType}" ` +
                            `but expected type "${expectedTypes}".`);
                    }
                }
            }
        }
    }

    setTransitionEndSupport();

    return Util;
})($);

export default Util;
