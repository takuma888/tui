import $ from 'jquery';


const Util = (($) => {
    let transition = false;

    const MAX_UID = 1000000;
    const TRANSITION_END = 'transitionend';
    const MILLISECONDS_MULTIPLIER = 1000;

    // Shoutout AngusCroll (https://goo.gl/pxwQGp)
    function toType(obj) {
        return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase()
    }

    function getSpecialTransitionEndEvent() {
        return {
            bindType: TRANSITION_END,
            delegateType: TRANSITION_END,
            handle(event) {
                if ($(event.target).is(this)) {
                    return event.handleObj.handler.apply(this, arguments) // eslint-disable-line prefer-rest-params
                }
                return undefined // eslint-disable-line no-undefined
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

        getTransitionDurationFromElement(element) {
            if (!element) {
                return 0;
            }

            // Get transition-duration of the element
            let transitionDuration = $(element).css('transition-duration');
            const floatTransitionDuration = parseFloat(transitionDuration);

            // Return 0 if element or transition duration is not found
            if (!floatTransitionDuration) {
                return 0;
            }

            // If multiple durations are defined, take the first
            transitionDuration = transitionDuration.split(',')[0];

            return parseFloat(transitionDuration) * MILLISECONDS_MULTIPLIER;
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
