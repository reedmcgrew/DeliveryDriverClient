// TODO Update to express version 3.0
// Set-up Web Server
var fs = require('fs');
var express = require('express');
var settings = require('./settings');

var webserver = module.exports = express.createServer({
  key: fs.readFileSync(settings.key || './ssl-dev/server.key'),
  cert: fs.readFileSync(settings.cert || './ssl-dev/server.crt'),
});

webserver.configure(function(){
  webserver.use(express.bodyParser());
  webserver.use(express.methodOverride());
  webserver.use(webserver.router);
  webserver.use(express.static(__dirname + '/public'));
});
webserver.configure('development', function(){
  webserver.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
webserver.configure('production', function(){
  webserver.use(express.errorHandler());
});

