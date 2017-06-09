'use strict';

var hasClass = require('./hasClass');
var addClass = require('./addClass');
var removeClass = require('./removeClass');

module.exports = function toggleClass(target, className) {
    if (hasClass(target, className)) {
        return removeClass(target, className);
    }
    return addClass(target, className);
};