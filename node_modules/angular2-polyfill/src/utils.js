"use strict";
var dotProp = require('dot-prop');
var camelcase = require('camelcase');
var core_1 = require('./core/core');
/**
 * Helper functions
 */
function annotate(target, key, value) {
    if (!target.__annotations__) {
        target.__annotations__ = {};
    }
    dotProp.set(target.__annotations__, key, value);
}
exports.annotate = annotate;
function toInjectorName(token) {
    if (typeof token === 'string') {
        return token;
    }
    if (token instanceof core_1.OpaqueToken) {
        return camelcase(token.toString());
    }
    return token.name;
}
exports.toInjectorName = toInjectorName;
