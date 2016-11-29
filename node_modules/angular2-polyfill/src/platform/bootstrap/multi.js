"use strict";
var id = 0;
var prefix = 'ng2Multi';
var map = {};
function bootstrapMulti(fn, ngModule, name, target) {
    map[name] = map[name] || [];
    // Create a unique name
    var privateName = prefix + "_" + fn + "_" + name + "_" + ++id;
    ngModule[fn](privateName, target);
    // Add the name as dependency to the eventual result
    map[name].push(privateName);
    // Create a factory with the original name that returns all the other factories
    ngModule.factory(name, map[name].concat([function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return args;
    }]));
}
function bootstrapMultiFactory(ngModule, name, target) {
    bootstrapMulti('factory', ngModule, name, target);
}
exports.bootstrapMultiFactory = bootstrapMultiFactory;
function bootstrapMultiInjectable(ngModule, name, target) {
    bootstrapMulti('service', ngModule, name, target);
}
exports.bootstrapMultiInjectable = bootstrapMultiInjectable;
function bootstrapMultiValue(ngModule, name, target) {
    bootstrapMulti('value', ngModule, name, target);
}
exports.bootstrapMultiValue = bootstrapMultiValue;
