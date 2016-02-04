"use strict";

var fs = require('fs');
var path = require('path');
var definition = require('./format.json');

class Parse {
    constructor(format) {
        this.keys = [];
        var knownFormat = {
            'common-log' : '%h %l %u %t \"%r\" %>s %b'
        }[format];
        this.expression = this.extract(knownFormat || format);
    }
    extract(format) {
        // get only formatting tokens
        format = format.match(/[%\w>]+/g);

        var capture = (function extract(format, keys) {
            var token = format.shift();
            if (definition[token]) keys.push(definition[token].key);
            var match = definition[token] && definition[token].match || '[^\\s]+';
            return !format.length ? '' : `(${match})` + '\\s+' + extract(format, keys);
        })(format, this.keys);

        return new RegExp(capture);
    }
    expand(line) {
        var o = {};
        line.match(this.expression)
            .slice(1)
            .forEach(function(v, i){
                if (this.keys[i] === 'request') {
                    o['path'] = v.split(' ')[1];
                }
                else o[this.keys[i]] = v;
        }, this);
        return o;
    }
    build(log) {
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
    log(filename, format) {
        // string or function, parse log format
        var content = fs.readFileSync(path.join(__dirname, filename), 'utf8');
        return format && typeof format === 'function' ? format(content) : this.extract(format, content);
    }
}

module.exports = Parse;
