"use strict";
var OpaqueToken = (function () {
    function OpaqueToken(_desc) {
        this._desc = _desc;
    }
    OpaqueToken.prototype.toString = function () {
        return "Token " + this._desc;
    };
    return OpaqueToken;
}());
exports.OpaqueToken = OpaqueToken;
