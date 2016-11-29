"use strict";
var injector = require('../utils/injector');
var multi_1 = require('./multi');
function bootstrap(ngModule, target) {
    var annotations = target.__annotations__;
    var factory = annotations.factory;
    injector.inject(ngModule, target);
    var name = factory.name || target.name;
    if (annotations.multi === true) {
        multi_1.bootstrapMultiFactory(ngModule, name, target);
    }
    else {
        ngModule.factory(name, target);
    }
    return name;
}
exports.bootstrap = bootstrap;
