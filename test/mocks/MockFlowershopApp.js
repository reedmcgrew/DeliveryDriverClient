/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , path = require('path')
  , HookIo = require('hook.io');

var app = express.createServer();

exports.bootstrap = function(bootstrapDetails){
    return function(callback){
        //Application Configuration
        app.configure(function(){
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

        //Application bus
        app.bus = HookIo.createHook({
            name: 'flowershopBus',
        });

        //Application routes
        app.post('/deliveries/:id', function(req,res){
            res.send(200);
            app.bus.emit('external-event-received',req.body.data);
        });
        
        //Top-level application methods
        app.getFlowershopEslBase = function(){
            return "http://"+bootstrapDetails.host+":"+bootstrapDetails.port+"/"+
                bootstrapDetails.eslBaseRoute+"/"
        };

        app.listen(bootstrapDetails.port, function(){
            console.log("FlowershopApp server listening on port " + app.address().port);
            app.bus.on("hook::ready", function(){
                console.info("FLOWERSHOP APP BUS READY");
                callback(app);
            });
            //app.bus.start();
        });
    };
};