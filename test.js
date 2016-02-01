var request = require('request');
var expect = require('chai').expect;
var runner = require('index');

describe("status codes", function() {
    ['200', '404', '301'].forEach(function(statusCode) {
        describe(statusCode, function() {
            runner.requests[statusCode].forEach(function(obj) {
                it(obj.path, function(done) {
                    var start = new Date();
                    var self = this;
                    request({
                        method: "GET",
                        url : [runner.host, obj.path].join(''),
                        followRedirects : false
                    }, function(err, response) {
                        var responseTime = new Date() - start;
                        var difference = responseTime - Number(obj.varnishTime);
                        self._runnable.title = '(' + (difference) + 'ms) ' + self._runnable.title;
                        expect(responseTime).to.be.below(obj.varnishTime);
                        expect(response.statusCode).to.equal(Number(statusCode));
                        done();
                    });
                });
            });
        });
    });
});