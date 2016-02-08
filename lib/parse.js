"use strict";

var fs = require('fs');
var url = require('url');
var path = require('path');
var definition = require('./format.json');

class Parse {
    constructor(format) {
        this.keys = [];
        var knownFormat = {
            common : '%h %l %u %t \"%r\" %>s %b',
            combined : '%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-agent}i\"'
        }[format];
        this.expression = this.extract(knownFormat || format);
    }
    extract(format) {
        // get only formatting tokens
        format = format.match(/[%\w>\{\}\-]+/g);

        var capture = (function extract(format, keys) {
            if (!format.length) return '';
            var token = format.shift();
            if (definition[token]) keys.push(definition[token].key);
            var match = definition[token] && definition[token].match || '[^\\s]+';
            return `(${match})` + (format.length ? '\\s+' : '') + extract(format, keys);
        })(format, this.keys);

        return new RegExp(capture);
    }
    expand(line) {
        var o;
        var matches = line.match(this.expression);
        if (matches) {
            o = {};
            matches.slice(1)
                .forEach(function(v, i){
                    // todo: remove formatting hack \"
                    v = v.replace(/"/g, '');

                    if (this.keys[i] === 'request') {
                        var path = v.split(' ')[1];
                        o['path'] = url.parse(path).pathname;
                    }
                    else if (this.keys[i] === 'status_code') {
                        o[this.keys[i]] = Number(v);
                    }
                    else o[this.keys[i]] = v;
            }, this);
        }
        return o;
    }
    build(content) {
        var requests = {};
        // todo: support cross-platform newlines, make async
        content.split('\n').forEach(entry => {
            var obj = this.expand(entry);
            if (obj) {
                // group by status code
                var key = requests[obj.status_code] ? requests[obj.status_code] : (requests[obj.status_code] = []);
                key.push(obj);
            }
        });
        return requests;
    }
    log(filename) {
        var content = fs.readFileSync(path.join(process.cwd(), filename), 'utf8');
        // todo: support cross-platform newlines, make async
        return this.build(content);
    }
}

module.exports = Parse;
