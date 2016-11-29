"use strict";
/**
 * Bind the inputs defined on the target to the directive.
 */
function bind(target, directive) {
    var annotations = target.__annotations__;
    var component = annotations.component || annotations.directive;
    function toBinding(key, value) {
        var match = value.match(/^([@=<])?(.*)?$/);
        if (match[1]) {
            // signed inputs (<, @, =)
            return {
                key: match[2] || key,
                value: match[1] + (match[2] || key)
            };
        }
        var sign = '@';
        if (Reflect.hasMetadata('design:type', target.prototype, key)) {
            // If the type is not a primitive, use pass-by-reference
            var type = Reflect.getMetadata('design:type', target.prototype, key);
            if (type.name !== 'String' && type.name !== 'Number' && type.name !== 'Boolean') {
                sign = '=';
            }
        }
        return {
            key: key,
            value: sign + value
        };
    }
    // Bind all the elements in the `inputs` array
    (component.inputs || []).forEach(function (key) {
        var mapping = key.split(/:[ ]*/);
        var binding = toBinding(mapping[0], mapping[1] || mapping[0]);
        directive.bindToController[binding.key] = binding.value;
    });
    // Bind all the elements in the `@Input` annotation list
    Object.keys(annotations.inputs || {}).forEach(function (key) {
        var binding = toBinding(key, annotations.inputs[key]);
        directive.bindToController[binding.key] = binding.value;
    });
}
exports.bind = bind;
