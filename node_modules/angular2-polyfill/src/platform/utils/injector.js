"use strict";
/**
 * Creates a factory with the name `@Optional({injectable})` which checks
 * if the injectable exists or not. If the injectable exists, the factory
 * will return the injectable, if not, it will return `null`.
 *
 * @param {ng.IModule}	ngModule	The root module.
 * @param {string}		injectable	The name of the optional injectable.
 * @returns {string}				The name of the factory.
 */
function createOptionalInject(ngModule, injectable) {
    var name = "@Optional(" + injectable + ")";
    var factory = function ($injector) {
        if ($injector.has(injectable)) {
            return $injector.get(injectable);
        }
        return null;
    };
    factory.$inject = ['$injector'];
    // Create the factory
    ngModule.factory(name, factory);
    return name;
}
function inject(ngModule, target) {
    var annotations = target.__annotations__ || {};
    var injectables = [];
    if (annotations.inject) {
        annotations.inject.forEach(function (injectable, index) {
            var name = typeof injectable === 'string' ? injectable : injectable.name;
            if (annotations.optional && annotations.optional[index] === true) {
                // If the injectable is optional, replace the name with the optional injector
                name = createOptionalInject(ngModule, name);
            }
            injectables[index] = name;
        });
    }
    if (Reflect.hasMetadata('design:paramtypes', target)) {
        Reflect.getMetadata('design:paramtypes', target).forEach(function (type, index) {
            if (type.name !== 'Object' && injectables[index] === undefined) {
                var name_1 = type.name;
                if (annotations.optional && annotations.optional[index] === true) {
                    // If the injectable is optional, replace the name with the optional injector
                    name_1 = createOptionalInject(ngModule, name_1);
                }
                injectables[index] = name_1;
            }
        });
    }
    target.$inject = injectables;
}
exports.inject = inject;
