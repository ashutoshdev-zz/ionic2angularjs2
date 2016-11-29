"use strict";
var camelcase = require('camelcase');
var dotProp = require('dot-prop');
function parseHostBinding(key) {
    var regex = [
        { type: 'attr', regex: /^([a-zA-Z]+)$/ },
        { type: 'prop', regex: /^\[([a-zA-Z\.-]+)\]$/ },
        { type: 'event', regex: /^\(([a-zA-Z]+)\)$/ }
    ];
    for (var i = 0; i < regex.length; i++) {
        var match = key.match(regex[i].regex);
        if (match !== null) {
            return { type: regex[i].type, value: match[1] };
        }
    }
    ;
    return { type: undefined, value: key };
}
function applyValueToProperties(el, properties, value) {
    properties.forEach(function (property) {
        var splitted = property.split('.');
        if (splitted.length === 1) {
            // Set the property directly
            el.prop(camelcase(property), value);
        }
        else {
            var root = splitted.shift();
            if (root === 'class') {
                // Handle adding/removing class names
                var method = value ? 'addClass' : 'removeClass';
                el[method](splitted.join('.'));
            }
            else {
                // Handle deeply nested properties
                var runner = el.prop(camelcase(root));
                while (splitted.length > 1) {
                    runner = runner[camelcase(splitted.shift())];
                }
                runner[camelcase(splitted.shift())] = value;
            }
        }
    });
}
function parse(hostBindings) {
    var result = {
        attrs: {},
        events: {},
        props: {
            raw: {},
            expressions: {}
        }
    };
    Object.keys(hostBindings).forEach(function (key) {
        var value = hostBindings[key];
        var parsed = parseHostBinding(key);
        if (parsed.type === 'attr') {
            result.attrs[parsed.value] = value;
        }
        else if (parsed.type === 'event') {
            var handler = value.match(/^([a-zA-Z]+)\((.*?)\)$/);
            var method = handler[1];
            var params = handler[2].length === 0 ? [] : handler[2].split(/,[ ]*/);
            result.events[parsed.value] = { method: method, params: params };
        }
        else if (parsed.type === 'prop') {
            var raw = value.match(/^['"](.*?)['"]$/);
            var map = 'expressions';
            if (raw) {
                // If the value is escaped, it's a raw value and should be applied directly
                value = raw[1];
                map = 'raw';
            }
            result.props[map][value] = result.props[map][value] || [];
            result.props[map][value].push(parsed.value);
        }
    });
    return result;
}
exports.parse = parse;
function bind(scope, el, hostBindings, controllerAs) {
    if (controllerAs === void 0) { controllerAs = '$ctrl'; }
    // Handle attributes
    Object.keys(hostBindings.attrs).forEach(function (attribute) {
        el.attr(attribute, hostBindings.attrs[attribute]);
    });
    // Handle host listeners
    Object.keys(hostBindings.events).forEach(function (event) {
        var target = hostBindings.events[event];
        el.bind(event, function (e) {
            var ctx = { $event: e };
            // use scope.$apply because we are outside the angular digest cycle
            scope.$apply(function () {
                scope[controllerAs][target.method].apply(scope[controllerAs], target.params.map(function (param) { return dotProp.get(ctx, param); }));
            });
        });
    });
    // Handle host property bindings
    Object.keys(hostBindings.props.raw).forEach(function (value) {
        var properties = hostBindings.props.raw[value];
        applyValueToProperties(el, properties, value);
    });
    Object.keys(hostBindings.props.expressions).forEach(function (expression) {
        var properties = hostBindings.props.expressions[expression];
        scope.$watch(controllerAs + "." + expression, function (newValue) {
            applyValueToProperties(el, properties, newValue);
        });
    });
}
exports.bind = bind;
