'use strict';

var bind = window.addEventListener ? 'addEventListener' : 'attachEvent';
var unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent';
var eventPrefix = bind !== 'addEventListener' ? 'on' : '';

/**
 * Unbind `target` event `eventName`'s callback `listener`.
 *
 * @param {Element} target
 * @param {String} eventName
 * @param {Function} listener
 * @param {Boolean} capture
 * @api public
 */
module.exports = function off(target, eventName, listener) {
  var capture = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

  target[unbind](eventPrefix + eventName, listener, capture);
};