'use strict';

module.exports = function onFocus(listener) {
    var useFocusin = !document.addEventListener;
    var off = void 0;

    if (useFocusin) {
        document.attachEvent('onfocusin', listener);
        off = function off() {
            return document.detachEvent('onfocusin', listener);
        };
    } else {
        document.addEventListener('focus', listener, true);
        off = function off() {
            return document.removeEventListener('focus', listener, true);
        };
    }

    return {
        off: off
    };
};