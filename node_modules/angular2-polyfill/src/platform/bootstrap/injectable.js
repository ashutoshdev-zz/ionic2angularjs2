"use strict";
var injector = require('../utils/injector');
var multi_1 = require('./multi');
function bootstrap(ngModule, target) {
    var annotations = target.__annotations__ || {};
    var injectable = annotations.injectable || {};
    // DI
    injector.inject(ngModule, target);
    var name = injectable.name || target.name;
    if (annotations.multi === true) {
        multi_1.bootstrapMultiInjectable(ngModule, name, target);
    }
    else {
        ngModule.service(name, target);
    }
    return name;
}
exports.bootstrap = bootstrap;
