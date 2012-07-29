/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , path = require('path');


var configureWebLayer = function(app,serverDetails) {
    app.configure(function () {
        app.set('port', process.env.PORT || serverDetails.port);
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.use(express.favicon());
        app.use(express.logger('dev'));
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
    //Application routes
    app.get('/', function(req,res){
        res.send('All Good!',200);
    });
    app.post('/drivers/:id', function(req,res){
        console.info("Drivers Post Received: "+req.params.id);
        console.info(req.body);

        //Decode payload
        var body = req.body.data;
        var driverId = req.params.id;
        var data = {
            'delivery': body.delivery,
            'flowershop': body.flowershop,
            'driverId': driverId
        };

        //Pass events off to the internal bus
        var eventName = req.body._name;
        if(eventName === "delivery-ready"){
            //Generate explicit delivery ready event
            store.put('deliveries',data.delivery.id,data.delivery);
            bus.emit(eventName,data);
        }
        else if(eventName === "bid-accepted"){
            bus.emit(eventName,data);
        }

        //respond
        res.send(200);
    });
};

exports.DriverWebLayer = function(bus,store,serverDetails){
    var app = express();
    configureWebLayer(app,serverDetails);
    attachRoutes(app,bus,store);
    return {'webserver':app,
        'bus': bus,
        'store': store,
        'getDriverEslBase': function () {
            var eslBase = "http://" + serverDetails.host + ":" + serverDetails.port + "/drivers/";
            console.info("Driver ESL Base Requested: " + eslBase);
            return eslBase;
        },
        'run': function(callback,returnObject){
            http.createServer(app).listen(app.get('port'), function(){
                console.log("DriverApp server listening on port " + app.get('port'));
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
