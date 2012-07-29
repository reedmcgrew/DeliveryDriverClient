// Set-up Web Server
var fs = require('fs');
var path = require('path');
var express = require('express');

module.exports = function(port){
    var webserver = express.createServer({
        key: fs.readFileSync(path.resolve(__dirname,'./ssl-dev/server.key')),
        cert: fs.readFileSync(path.resolve(__dirname,'./ssl-dev/server.crt'))
    });

    webserver.configure(function(){
      webserver.set('port', port);
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
    return webserver;
};

