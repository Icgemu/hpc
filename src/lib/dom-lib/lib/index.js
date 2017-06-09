'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var className = require('./class');
var style = require('./style');
var query = require('./query');
var events = require('./events');
var transition = require('./transition');
var animation = require('./animation');
var getVendorPrefixedName = require('./getVendorPrefixedName');
var BrowserSupportCore = require('./BrowserSupportCore');
var DOMMouseMoveTracker = require('./DOMMouseMoveTracker');

module.exports = _extends({}, className, style, query, events, animation, {
    transition: transition,
    getVendorPrefixedName: getVendorPrefixedName,
    BrowserSupportCore: BrowserSupportCore,
    DOMMouseMoveTracker: DOMMouseMoveTracker
});