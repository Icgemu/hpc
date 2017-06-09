'use strict';

var bind = window.addEventListener ? 'addEventListener' : 'attachEvent';
var unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent';
var eventPrefix = bind !== 'addEventListener' ? 'on' : '';

/**
 * Bind `target` event `eventName`'s callback `listener`.
 * @param  {Element} target
 * @param  {String} eventName
 * @param  {Function} listener
 * @param  {Boolean} capture
 * @return {Object}
 */
module.exports = function on(target, eventName, listener) {
    var capture = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

    target[bind](eventPrefix + eventName, listener, capture);
    return {
        off: function off() {
            target[unbind](eventPrefix + eventName, listener, capture);
        }
    };
};