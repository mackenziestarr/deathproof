var request = require('request');
var expect = require('chai').expect;
var runner = require('.');

describe("status codes", function() {
    Object.keys(runner.requests).forEach(function(statusCode) {
        describe(statusCode, function() {
            runner.requests[statusCode].forEach(function(obj) {
                it(obj.path, function(done) {
                    request({
                        method: "GET",
                        url : [runner.host, obj.path].join(''),
                        followRedirects : false
                    }, function(err, response) {
                        expect(response.statusCode).to.equal(obj.status_code);
                        done();
                    });
                });
            });
        });
    });
});