'use strict';

var hyphenateStyleName = require('./hyphenateStyleName');
var removeStyle = require('./removeStyle');

module.exports = function addStyle(node, property, value) {
    var css = '';
    var props = property;

    if (typeof property === 'string') {
        if (value === undefined) {
            new Error('value is undefined');
        }
        (props = {})[property] = value;
    }

    for (var key in props) {
        if (Object.prototype.hasOwnProperty.call(props, key)) {
            !props[key] && props[key] !== 0 ? removeStyle(node, hyphenateStyleName(key)) : css += hyphenateStyleName(key) + ':' + props[key] + ';';
        }
    }

    node.style.cssText += ';' + css;
};