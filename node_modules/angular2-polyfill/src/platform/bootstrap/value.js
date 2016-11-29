"use strict";
var multi_1 = require('./multi');
function bootstrap(ngModule, target) {
    var annotations = target.__annotations__;
    var value = annotations.value;
    var name = value.name;
    var ret = value.value;
    if (annotations.multi === true) {
        multi_1.bootstrapMultiValue(ngModule, name, ret);
    }
    else {
        ngModule.value(name, ret);
    }
    return name;
}
exports.bootstrap = bootstrap;
