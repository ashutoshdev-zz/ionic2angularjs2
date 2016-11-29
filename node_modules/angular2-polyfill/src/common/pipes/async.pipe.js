"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Thanks to @cvuorinen for the angular1-async-filter
 * https://github.com/cvuorinen/angular1-async-filter
 */
var core_1 = require('../../core/core');
var AsyncPipe = (function () {
    function AsyncPipe() {
    }
    AsyncPipe.objectId = function (obj) {
        if (!obj.hasOwnProperty('__asyncFilterObjectID__')) {
            obj.__asyncFilterObjectID__ = ++AsyncPipe.currentObjectID;
        }
        return obj.__asyncFilterObjectID__;
    };
    AsyncPipe.prototype.transform = function (input, _a) {
        var scope = _a[0];
        if (!input || !(input.subscribe || input.then)) {
            return input;
        }
        var inputId = AsyncPipe.objectId(input);
        if (!(inputId in AsyncPipe.subscriptions)) {
            var subscriptionStrategy = input.subscribe && input.subscribe.bind(input)
                || input.success && input.success.bind(input) // To make it work with HttpPromise
                || input.then.bind(input);
            AsyncPipe.subscriptions[inputId] = subscriptionStrategy(function (value) {
                AsyncPipe.values[inputId] = value;
                if (scope && scope.$applyAsync) {
                    scope.$applyAsync(); // Automatic safe apply, if scope provided
                }
            });
        }
        return AsyncPipe.values[inputId] || undefined;
    };
    AsyncPipe.currentObjectID = 0;
    AsyncPipe.values = {};
    AsyncPipe.subscriptions = {};
    AsyncPipe = __decorate([
        core_1.Pipe({ name: 'async', pure: false })
    ], AsyncPipe);
    return AsyncPipe;
}());
exports.AsyncPipe = AsyncPipe;
