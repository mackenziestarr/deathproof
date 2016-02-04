var Parse = require('../parse');
var expect = require('chai').expect;

describe('log parser', function() {
    it('should build capture expression from format string', function() {
        var parse = new Parse('%h %l %u %t \"%r\" %>s %b');
        expect(parse.expression).to.exist;
        expect(parse.expression).to.be.an.instanceof(RegExp);
        var entry = '127.0.0.1 user-identifier merzbow [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326';
        var matches = entry.match(parse.expression);
        expect(matches).to.have.length(7);
    });
    it('should convert log entry to object given format', function() {
        var parse = new Parse('%h %l %u %t \"%r\" %>s %b');
        var line = '127.0.0.1 user-identifier merzbow [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326';
        var entry = parse.expand(line);
        expect(entry).to.exist;
        expect(entry).to.eql({
            client_ip: '127.0.0.1',
            client_id: 'user-identifier',
            client_name: 'merzbow',
            time: '[10/Oct/2000:13:55:36 -0700]',
            path: '/apache_pb.gif',
            status_code: '200'
        });
    });
    it('should support common formats', function() {
        var parse = new Parse('common-log');
        var line = '127.0.0.1 user-identifier merzbow [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326';
        var entry = parse.expand(line);
        expect(entry.path).to.equal('/apache_pb.gif');
    });
});
