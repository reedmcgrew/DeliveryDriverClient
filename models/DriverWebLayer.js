/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();

exports.startDriverWebLayer = function(bus,store,serverDetails,flowershopEslBase){
    return function(callback){
        //Application Configuration
        app.configure(function(){
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
        app.configure('development', function(){
            app.use(express.errorHandler());
        });

        //App resources
        app.bus = bus;
        app.store = store;

        //Application methods
        app.getDriverEslBase = function(){
            var eslBase = "http://"+serverDetails.host+":"+serverDetails.port+"/drivers/";
            console.info("Driver ESL Base Requested: " + eslBase);
            return eslBase;
        };

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
                app.store.put('deliveries',data.delivery.id,data.delivery);
                app.bus.emit(eventName,data);
            }
            else if(eventName === "bid-accepted"){
                app.bus.emit(eventName,data);
            }

            //respond
            res.send(200);
        });
        

        //Sub Operations
        require('../operations/listenForBidAvailableEvent')(app.bus,flowershopEslBase);
       
        http.createServer(app).listen(app.get('port'), function(){
            console.log("DriverApp server listening on port " + app.get('port'));
            bus.bootstrap(function(){
                console.info("Just bootstrapped the driver app bus!");
                callback(app);
            });
        });
    };
};
