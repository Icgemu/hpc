'use strict';

var camelizeStyleName = require('./camelizeStyleName');
var getComputedStyle = require('./getComputedStyle');
var hyphenateStyleName = require('./hyphenateStyleName');

module.exports = function getStyle(node, property) {
    return node.style[camelizeStyleName(property)] || getComputedStyle(node).getPropertyValue(hyphenateStyleName(property));
};