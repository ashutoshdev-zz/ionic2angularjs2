"use strict";
function Optional() {
    return function (target, propertyKey, parameterIndex) {
        if (!target.__annotations__) {
            target.__annotations__ = {};
        }
        target.__annotations__.optional = {};
        target.__annotations__.optional[parameterIndex] = true;
    };
}
exports.Optional = Optional;
