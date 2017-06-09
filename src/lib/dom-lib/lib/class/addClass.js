'use strict';

var hasClass = require('./hasClass');

module.exports = function addClass(target, className) {
    if (className) {
        if (target.classList) {
            target.classList.add(className);
        } else if (!hasClass(className, target)) {
            target.className = target.className + ' ' + className;
        }
    }
    return target;
};