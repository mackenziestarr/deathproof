# :skull: deathproof
server log driven regression testing

## Installation
via [npm](https://github.com/npm/npm)
```
$ npm install --save-dev deathproof
```
run script
```
$ node ./node_modules/deathproof 
```

## Usage
```
Usage: deathproof [options]

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -H, --host <host>      The full lowercased host portion of the URL, including port information
    -F, --file <file>      Path to log file
    -f, --format <format>  Named or custom log format
```

## Supported Formats
Deathproof supports common and combined log formats by specifiying 'common' or 'combined' after the --format flag 
```
$ node ./node_modules/deathproof --host 127.0.0.1:8000 --file /path/to/logfile --format common
```
It can also parse custom formats that use [apache style formatting codes](https://httpd.apache.org/docs/1.3/logs.html#common)
```
$ node ./node_modules/deathproof --host 127.0.0.1:8000 --file /path/to/logfile --format '%>s %b %h \"%r\"'
```
If these are not sufficient you can define your own formatting codes in [format.json](lib/format.json). Here is an example of a custom matcher.
```
"%rt" : {
    "key" : "response_time",
    "description" : "the response time of the request"
    "match" : "\\.*?ms"
}
```
