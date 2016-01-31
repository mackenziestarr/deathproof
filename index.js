var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path'),
    program = require('commander'),
    parse = require('./parse');

program
    .version('1.0.0')
    .option('-H, --host <host>', 'The full lowercased host portion of the URL, including port information')
    .option('-f, --file <file>', 'Path to log file')
    .parse(process.argv);

if (!program.host || !program.file) {
    console.log('usage: node index.js -H 127.0.0.1:8000 -f varnish200.log');
    program.help();
}

if (!program.host.startsWith('http://')) {
    program.host = 'http://' + program.host;
}

module.exports.host = program.host;

module.exports.requests = parse.log(program.file, (content) => {
    var requests = {};
    var regex = /amazonaws\.com(.*?)\s*HTTP\/1\.1\"\s(\w*)\s(\w*).*?\n/g;
    while ((match = regex.exec(content))) {
        var key = requests[match[2]] ? requests[match[2]] : (requests[match[2]] = []);
        //if (pathArg) {
        //    if (pathArg === match[1]) {
        //        key.push({path:match[1],varnishTime:match[3]});
        //    }
        //} else {
            key.push({path:match[1],varnishTime:match[3]});
        //}
    }
    return requests;
});


var mocha = new Mocha({ui: 'bdd'});
// Add each .js file to the mocha instance
fs.readdirSync(__dirname).filter(file => {
    // Only keep the .js files
    return file.substr(-3) === '.js';

}).forEach(file => {
    mocha.addFile(
        path.join(__dirname, file)
    );
});

// Run the tests.
mocha.run(failures => {
    process.on('exit', () => {
        process.exit(failures);
    });
});