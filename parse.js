var fs = require('fs');
var path = require('path');

var Parse = {
    log : (filename, fn) => {
        var content = fs.readFileSync(path.join(__dirname, filename), 'utf8');
        return fn && fn(content) || this.commonLogFormat(content);
    },
    commonLogFormat : log => {
        var requests = {};
        // todo: support cross-platform newlines
        log.split('\n').forEach(_entry => {
            var entry = _entry.trim().split(' ');
            var path = entry[6];
            var statusCode = Number(entry[8]);
            var key = requests[statusCode] ? requests[statusCode] : (requests[statusCode] = []);
            key.push({path, statusCode});
        });
        return requests;
    }
};

module.exports = Parse;
