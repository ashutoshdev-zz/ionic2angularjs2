"use strict";
var core_1 = require('./bootstrap/core');
var common_1 = require('../common/common');
var index_1 = require('./bootstrap/index');
var core_2 = require('../core/core');
function bootstrap(ngModule, component, providers) {
    if (providers === void 0) { providers = []; }
    // Bootstrap the core
    core_1.bootstrap(ngModule);
    // Bootstrap common components
    common_1.bootstrap(ngModule);
    // Bootstrap the injector
    index_1.bootstrap(ngModule, core_2.provide(core_2.Injector, { useFactory: function () { return new core_2.Injector(); } }));
    // Bootstrap providers
    providers.forEach(function (provider) { return index_1.bootstrap(ngModule, provider); });
    // Bootstrap the app tree
    index_1.bootstrap(ngModule, component);
}
exports.bootstrap = bootstrap;
