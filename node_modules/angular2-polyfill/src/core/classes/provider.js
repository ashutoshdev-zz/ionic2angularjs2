"use strict";
var Provider = (function () {
    function Provider(token, options) {
        this.token = token;
        this.useClass = options.useClass;
        this.useValue = options.useValue;
        this.useExisting = options.useExisting;
        this.useFactory = options.useFactory;
        this.deps = options.deps;
        this.multi = options.multi;
    }
    return Provider;
}());
exports.Provider = Provider;
