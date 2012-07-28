/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();

exports.bootstrapDriverApplication = function(bus,store,serverDetails,flowershopEslBase){
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
            var data = req.body.data;

            app.store.put('deliveries',data.delivery.id,data.delivery);

            //Generate explicit delivery ready event
            var genDeliveryReady = require('../operations/generateDeliveryReadyEvent')(app.bus);
            genDeliveryReady(data.delivery,data.flowershop,data.driver);
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
