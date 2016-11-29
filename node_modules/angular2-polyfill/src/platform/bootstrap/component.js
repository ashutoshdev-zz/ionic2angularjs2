"use strict";
var camelcase = require('camelcase');
var decamelize = require('decamelize');
var utils = require('./index');
var host = require('../utils/host');
var injector = require('../utils/injector');
var input = require('../utils/input');
var output = require('../utils/output');
var map = {};
var states = {};
function bootstrap(ngModule, target, parentState) {
    var annotations = target.__annotations__;
    var component = annotations.component;
    var name = camelcase(component.selector || target.name);
    var styleElements = [];
    var headEl = angular.element(document).find('head');
    if (map[target.name]) {
        return name;
    }
    map[target.name] = decamelize(component.selector || target.name, '-');
    // Bootstrap providers, directives and pipes
    (component.providers || []).forEach(function (provider) { return utils.bootstrap(ngModule, provider); });
    (component.directives || []).forEach(function (directive) { return utils.bootstrap(ngModule, directive); });
    (component.pipes || []).forEach(function (pipe) { return utils.bootstrap(ngModule, pipe); });
    // Define the style elements
    (component.styles || []).forEach(function (style) {
        styleElements.push(angular.element('<style type="text/css">@charset "UTF-8";' + style + '</style>'));
    });
    (component.styleUrls || []).forEach(function (url) {
        styleElements.push(angular.element('<link rel="stylesheet" href="' + url + '">'));
    });
    // Inject the services
    injector.inject(ngModule, target);
    var hostBindings = host.parse(component.host || {});
    ngModule
        .controller(target.name, target)
        .directive(name, ['$rootScope', '$compile', function ($rootScope, $compile) {
            var directive = {
                restrict: 'E',
                scope: {},
                bindToController: {},
                controller: target.name,
                controllerAs: component.exportAs || '$ctrl',
                transclude: true,
                compile: function () {
                    return {
                        pre: function (scope, el) {
                            // Prepend all the style elements to the `head` dom element
                            styleElements.forEach(function (el) { return headEl.prepend(el); });
                            // Bind the hosts
                            host.bind(scope, el, hostBindings, component.controllerAs);
                            if (target.prototype.ngOnInit) {
                                // Call the `ngOnInit` lifecycle hook
                                var init = $compile("<div ng-init=\"" + directive.controllerAs + ".ngOnInit();\"></div>")(scope);
                                el.append(init);
                            }
                            scope.$on('$destroy', function () {
                                // Remove all the style elements when destroying the directive
                                styleElements.forEach(function (el) { return el.remove(); });
                                if (target.prototype.ngOnDestroy) {
                                    // Call the `ngOnDestroy` lifecycle hook
                                    scope[directive.controllerAs].ngOnDestroy();
                                }
                            });
                        }
                    };
                }
            };
            // Bind inputs and outputs
            input.bind(target, directive);
            output.bind($rootScope, target, directive);
            // Set the template
            if (component.template) {
                directive.template = component.template;
            }
            else {
                directive.templateUrl = component.templateUrl;
            }
            return directive;
        }]);
    if (annotations.routes) {
        var cmpStates_1 = [];
        annotations.routes.forEach(function (route) {
            var name = route.name || route.as;
            var routerAnnotations = route.component.__annotations__ && route.component.__annotations__.router;
            var state = {
                name: name,
                url: route.path,
                isDefault: route.useAsDefault === true
            };
            // Bootstrap the route component if it's not the same as the target component
            if (route.component.name !== target.name) {
                bootstrap(ngModule, route.component, state);
            }
            // If the url ends with `/...` this is a non-terminal route and thus is abstract.
            if (state.url.substr(-4) === '/...') {
                state.url = state.url.substr(0, state.url.length - 4);
                state.abstract = true;
            }
            // Set the `parent` property if the parent is a non-terminal route
            if (parentState && parentState.url && parentState.url.substr(-4) === '/...') {
                state.parent = parentState.name;
            }
            // Set the template after we are sure the component has been bootstrapped
            state.template = "<" + map[route.component.name] + "></" + map[route.component.name] + ">";
            // Push the state to the component states
            cmpStates_1.push(state.name);
            // Keep track of all the application states
            states[name] = state;
            // Attach CanActivate router hook
            if (routerAnnotations && routerAnnotations.canActivate) {
                var hook = ['Router', '$state', '$stateParams'];
                if (Object.keys(routerAnnotations.canActivate.prototype).length > 0) {
                    if (!routerAnnotations.canActivate.prototype.routerCanActivate) {
                        throw new Error('@CanActivate class does not implement the `CanActivate` interface.');
                    }
                    hook.push(utils.bootstrap(ngModule, routerAnnotations.canActivate));
                }
                hook.push(function (router, $state, $stateParams, handler) {
                    var fn = handler ? handler.routerCanActivate : routerAnnotations.canActivate;
                    // Generate instructions for the previous and next state
                    return Promise.all([
                        router.generate([name, $stateParams]),
                        $state.current.name.length === 0 ? null : router.generate([$state.current.name, $state.params])
                    ]).then(function (instructions) {
                        // Call the routerCanActivate hook with the instructions
                        return Promise.resolve(fn.apply(handler, instructions));
                    }).then(function (result) {
                        if (!result) {
                            // Reject if the result is false
                            return Promise.reject('could not activate');
                        }
                    });
                });
                states[name].resolve = {
                    routerCanActivate: hook
                };
            }
        });
        ngModule.config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
                cmpStates_1.forEach(function (name) {
                    var state = states[name];
                    $stateProvider.state(name, state);
                    if (state.isDefault) {
                        if (state.parent) {
                            var parentState_1 = states[state.parent];
                            var from = parentState_1.url;
                            while (parentState_1.parent) {
                                parentState_1 = states[parentState_1.parent];
                                from = parentState_1.url + from;
                            }
                            $urlRouterProvider.when(from, from + state.url);
                        }
                        else {
                            $urlRouterProvider.otherwise(state.url);
                        }
                    }
                });
            }]);
    }
    return name;
}
exports.bootstrap = bootstrap;
