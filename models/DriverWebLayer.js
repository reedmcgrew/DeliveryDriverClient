/**
 * Module dependencies.
 */
var express = require('express')
  , https = require('https')
  , path = require('path')
    , fs = require('fs');


var configureWebLayer = function(app,serverDetails) {
    app.configure(function () {
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.cookieParser());
        app.use(express.session({secret: "asldkjfa;sldkfbemenwjwbehrfu"}));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(app.router);
        app.use(express.static(path.join(__dirname, 'public')));
    });
    app.configure('development', function () {
        app.use(express.errorHandler());
    });

};

var attachRoutes = function(app, bus, store){
    var routes = require('../routes');
    var foursquare = require('./Foursquare');
    //Application routes
    app.post('/drivers/:id', routes.driverEslHandler(bus,store));
    app.get('/foursquare-callback', routes.authenticate(foursquare,store));
    app.get('/', routes.connect(foursquare),function(req,res){
        res.send("It's all okay",200);
    });
};

exports.DriverWebLayer = function(bus,store,serverDetails){
    var app = express.createServer({
        key: fs.readFileSync(path.resolve(__dirname,'./ssl-dev/server.key')),
        cert: fs.readFileSync(path.resolve(__dirname,'./ssl-dev/server.crt'))
    });
    configureWebLayer(app,serverDetails);
    attachRoutes(app,bus,store);
    return {'webserver': app,
        'bus': bus,
        'store': store,
        'getDriverEslBase': function () {
            var eslBase = "http://" + serverDetails.host + ":" + serverDetails.port + "/drivers/";
            console.info("Driver ESL Base Requested: " + eslBase);
            return eslBase;
        },
        'run': function(callback,returnObject){
            app.listen(serverDetails.port, function(){
                console.log("DriverApp server listening on port " + app.address().port);
                bus.bootstrap(function(){
                    console.info("Just bootstrapped the driver app bus!");
                    callback(returnObject);
                });
            });
        }

    };
};

exports.startDriverWebLayer = function(bus,store,serverDetails,flowershopEslBase){
    return function(callback){
        var driverWebLayer = exports.DriverWebLayer(bus,store,serverDetails);
        require('../operations/application/listenForBidAvailableEvent')(bus,flowershopEslBase);
        driverWebLayer.run(callback,driverWebLayer);
    };
};
