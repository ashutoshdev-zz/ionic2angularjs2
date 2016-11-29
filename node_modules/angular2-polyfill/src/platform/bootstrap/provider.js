"use strict";
var utils_1 = require('../../utils');
var utils = require('./index');
function bootstrap(ngModule, provider) {
    var target = {};
    var name = utils_1.toInjectorName(provider.token);
    var inject = (provider.deps || []).map(utils_1.toInjectorName);
    if (provider.useValue) {
        var value = provider.useValue;
        utils_1.annotate(target, 'value', { name: name, value: value });
    }
    else if (provider.useFactory) {
        target = provider.useFactory;
        utils_1.annotate(target, 'factory', { name: name });
        utils_1.annotate(target, 'inject', inject);
    }
    else if (provider.useClass) {
        target = provider.useClass;
        utils_1.annotate(target, 'injectable', { name: name });
    }
    else if (provider.useExisting) {
        target = function (v) { return v; };
        utils_1.annotate(target, 'factory', { name: name });
        utils_1.annotate(target, 'inject', [utils_1.toInjectorName(provider.useExisting)]);
    }
    utils_1.annotate(target, 'multi', provider.multi);
    utils.bootstrap(ngModule, target);
}
exports.bootstrap = bootstrap;
