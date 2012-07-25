/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , path = require('path')
  , SubOps = require('./SubOps');

var app = express();

exports.bootstrap = function(bus,store,flowershopEslBase){
    return function(callback){
        //Application Configuration
        app.configure(function(){
          app.set('port', process.env.PORT || 4000);
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

        //Application routes
        app.get('/', function(req,res){
            res.send('All Good!',200);
        });
        
        app.bus = bus;

        //Sub Operations
        SubOps.listenForBidAvailableEvent(app.bus,flowershopEslBase); 
       
        http.createServer(app).listen(app.get('port'), function(){
            console.log("FlowershopApp server listening on port " + app.get('port'));
            bus.bootstrap(function(){
                console.info("Just bootstrapped the driver app bus!");
                callback(app);
            });
        });
    };
};
