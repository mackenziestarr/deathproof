var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path'),
    program = require('commander'),
    Parse = require('./lib/parse');

program
    .version('1.0.0')
    .option('-H, --host <host>', 'The full lowercased host portion of the URL, including port information')
    .option('-F, --file <file>', 'Path to log file')
    .option('-f, --format <format>', 'Named or custom log format')
    .parse(process.argv);

if (!program.host || !program.file || !program.format) program.help();

if (!program.host.startsWith('http://')) {
    program.host = 'http://' + program.host;
}

module.exports.host = program.host;

module.exports.requests = new Parse(program.format).log(program.file);

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