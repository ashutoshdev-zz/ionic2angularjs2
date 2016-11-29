"use strict";
var utils_1 = require('../../utils');
var Injector = (function () {
    function Injector() {
        this._injector = angular.element(document).injector();
    }
    Injector.prototype.get = function (token) {
        var name = utils_1.toInjectorName(token);
        return this._injector.get(name);
    };
    Injector.prototype.getOptional = function (token) {
        try {
            var name_1 = utils_1.toInjectorName(token);
            return this._injector.get(name_1);
        }
        catch (err) {
            return null;
        }
    };
    return Injector;
}());
exports.Injector = Injector;
