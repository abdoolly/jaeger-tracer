"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a = require('opentracing'), Tags = _a.Tags, FORMAT_HTTP_HEADERS = _a.FORMAT_HTTP_HEADERS;
var interceptor = require('express-interceptor');
exports.setReqSpanData = function (req, res, span) {
    span.setTag(Tags.HTTP_URL, req.path);
    span.setTag(Tags.HTTP_METHOD, req.method);
    span.log({
        event: 'request',
        body: req.body,
        params: req.params,
        query: req.query,
    });
    return span;
};
exports.setResSpanData = function (req, res, span) {
    res.once('error', function (err) {
        span.log({
            event: 'response',
            status: 'error',
            error: err,
        });
        span.finish();
    });
    var responseInterceptor = function (body, send) {
        span.log({
            event: 'response',
            status: 'normal',
            body: body,
        });
        span.finish();
        return send(body);
    };
    return interceptor(function (req, res) {
        return {
            isInterceptable: function () { return true; },
            intercept: responseInterceptor
        };
    });
};
//# sourceMappingURL=spanDataSetter.js.map