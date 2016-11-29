"use strict";
var core_1 = require('../../core/core');
var component_1 = require('./component');
var directive_1 = require('./directive');
var factory_1 = require('./factory');
var pipe_1 = require('./pipe');
var value_1 = require('./value');
var injectable_1 = require('./injectable');
var provider_1 = require('./provider');
function bootstrap(ngModule, target) {
    if (Array.isArray(target)) {
        return target.forEach(function (target) { return bootstrap(ngModule, target); });
    }
    if (target.__annotations__) {
        if (target.__annotations__.component) {
            return component_1.bootstrap(ngModule, target);
        }
        else if (target.__annotations__.directive) {
            return directive_1.bootstrap(ngModule, target);
        }
        else if (target.__annotations__.factory) {
            return factory_1.bootstrap(ngModule, target);
        }
        else if (target.__annotations__.pipe) {
            return pipe_1.bootstrap(ngModule, target);
        }
        else if (target.__annotations__.value) {
            return value_1.bootstrap(ngModule, target);
        }
    }
    if (target instanceof core_1.Provider) {
        return provider_1.bootstrap(ngModule, target);
    }
    return injectable_1.bootstrap(ngModule, target);
}
exports.bootstrap = bootstrap;
