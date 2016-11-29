"use strict";
var core_1 = require('../core');
function provide(token, options) {
    return new core_1.Provider(token, options);
}
exports.provide = provide;
