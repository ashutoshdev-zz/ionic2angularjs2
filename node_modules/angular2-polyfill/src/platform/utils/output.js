"use strict";
/**
 * Creates a property with the name of the key provided to the target
 * prototype. Whenever a binding with that name is set, the `set` method of
 * that property is called and we can hook into the internals. This way we can also
 * handle event emitters.
 */
function attachPropertyHook(scope, target, key, name) {
    var wrapper = "__" + name + "Fn";
    Object.defineProperty(target.prototype, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            return this[("_" + name)];
        },
        set: function (value) {
            var _this = this;
            if (this[wrapper] === undefined) {
                // Catch the `<any foo="$ctrl.listener($event)" />` setter
                this[wrapper] = value;
            }
            if (typeof value === 'function') {
                // If it is a function, the result is just the wrapper function
                this[("_" + name)] = this[wrapper];
            }
            else if (value && value.emit && value.subscribe) {
                // It's an EventEmitter
                this[("_" + name)] = value;
                value.subscribe(function (e) {
                    scope.$apply(function () {
                        _this[wrapper]({ $event: e });
                    });
                });
            }
        }
    });
}
function bind(scope, target, directive) {
    var annotations = target.__annotations__;
    var component = annotations.component || annotations.directive;
    // Bind all the elements in the `outputs` array
    (component.outputs || []).forEach(function (key) {
        var mapping = key.split(/:[ ]*/);
        var name = mapping[1] || mapping[0];
        attachPropertyHook(scope, target, key, name);
        directive.bindToController[mapping[0]] = "&" + name;
    });
    // Bind all the `@Output` annotations
    Object.keys(annotations.outputs || {}).forEach(function (key) {
        var name = annotations.outputs[key];
        attachPropertyHook(scope, target, key, name);
        directive.bindToController[key] = "&" + name;
    });
}
exports.bind = bind;
