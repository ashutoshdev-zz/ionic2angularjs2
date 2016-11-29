"use strict";
var async_pipe_1 = require('./pipes/async.pipe');
var utils = require('../platform/bootstrap/index');
function bootstrap(ngModule) {
    utils.bootstrap(ngModule, [async_pipe_1.AsyncPipe]);
}
exports.bootstrap = bootstrap;
