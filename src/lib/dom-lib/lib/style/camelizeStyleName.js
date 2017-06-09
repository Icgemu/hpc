'use strict';

var _require = require('../utils/stringFormatter');

var camelize = _require.camelize;

var msPattern = /^ms-/;

module.exports = function camelizeStyleName(string) {
    return camelize(string.replace(msPattern, 'ms-'));
};