// Set-up Web Server
var express = require('express');
var webserver = module.exports = express.createServer();
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

