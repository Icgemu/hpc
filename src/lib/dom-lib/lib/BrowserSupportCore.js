'use strict';

var _getVendorPrefixedName = require('./getVendorPrefixedName');

var _getVendorPrefixedName2 = _interopRequireDefault(_getVendorPrefixedName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BrowserSupportCore = {
    /**
     * @return {bool} True if browser supports css animations.
     */
    hasCSSAnimations: function hasCSSAnimations() {
        return !!(0, _getVendorPrefixedName2.default)('animationName');
    },

    /**
     * @return {bool} True if browser supports css transforms.
     */
    hasCSSTransforms: function hasCSSTransforms() {
        return !!(0, _getVendorPrefixedName2.default)('transform');
    },

    /**
     * @return {bool} True if browser supports css 3d transforms.
     */
    hasCSS3DTransforms: function hasCSS3DTransforms() {
        return !!(0, _getVendorPrefixedName2.default)('perspective');
    },

    /**
     * @return {bool} True if browser supports css transitions.
     */
    hasCSSTransitions: function hasCSSTransitions() {
        return !!(0, _getVendorPrefixedName2.default)('transition');
    }
};

module.exports = BrowserSupportCore;