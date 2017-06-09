'use strict';

var _require = require('../utils/stringFormatter');

var hyphenate = _require.hyphenate;

var msPattern = /^ms-/;

module.exports = function hyphenateStyleName(string) {
    return hyphenate(string).replace(msPattern, '-ms-');
};