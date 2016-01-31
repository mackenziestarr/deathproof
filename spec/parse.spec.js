var parse = require('../parse');
var expect = require('chai').expect;

describe('log parser', function() {
   it('should parse common log format', function() {
       var requests = parse.commonLogFormat(
           `127.0.0.1 user-identifier frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326
            127.0.0.1 user-identifier frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326`
       );
       expect(requests).to.exist;
       expect(requests['200']).to.exist;
       expect(requests['200']).to.have.length(2);
       expect(requests['200'][0]).to.eql({path:'/apache_pb.gif', statusCode: 200});
   });
});
