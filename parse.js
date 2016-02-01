var fs = require('fs');
var url = require('url');
var path = require('path');

var Parse = {

    // string or function, parse log format
    log : (filename, format) => {
        var content = fs.readFileSync(path.join(__dirname, filename), 'utf8');
        return format && typeof format === 'function' ? format(content) : this.extract(format, content);
    },
    extract : function extract(format) {
        if (!(format instanceof Array)) {
            format = format.split(/ +/);
        }
        if (!format.length) return '';
        var argument = format.shift();
        var expression = {
            // time when request was recieved
            '%t' : '(\\[.*?\\])'
        }[argument];
        return (expression || '([^\\s]*)')
             + (format.length > 0 && '\\s*' || '')
             + extract(format);

        // varnish format string
        // %h %l %u %t "%r" %s %b "%{Referer}i" "%{User-agent}i"
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
