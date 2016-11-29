"use strict";
var host = require('../utils/host');
var injector = require('../utils/injector');
var input = require('../utils/input');
var output = require('../utils/output');
function parseSelector(selector) {
    var regex = [
        // {key: 'E', value: /^([a-zA-Z])$/},
        { key: 'A', value: /^\[([a-zA-Z]+)\]$/ },
        { key: 'C', value: /^\.([a-zA-Z]+)$/ }
    ];
    for (var i = 0; i < regex.length; i++) {
        var result = selector.match(regex[i].value);
        if (result !== null) {
            return { restrict: regex[i].key, name: result[1] };
        }
    }
    ;
    throw new Error("Selector " + selector + " could not be parsed");
}
function bootstrap(ngModule, target) {
    var annotations = target.__annotations__;
    var directive = annotations.directive;
    var selector = parseSelector(directive.selector);
    var hostBindings = host.parse(directive.host || {});
    // Inject the services
    injector.inject(ngModule, target);
    ngModule
        .controller(target.name, target)
        .directive(selector.name, ['$rootScope', function ($rootScope) {
            var declaration = {
                restrict: selector.restrict,
                scope: {},
                bindToController: {},
                controller: target.name,
                controllerAs: '$ctrl',
                link: function (scope, el) { return host.bind(scope, el, hostBindings); }
            };
            // Bind inputs and outputs
            input.bind(target, declaration);
            output.bind($rootScope, target, declaration);
            return declaration;
        }]);
}
exports.bootstrap = bootstrap;
