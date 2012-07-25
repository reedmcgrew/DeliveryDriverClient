/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , path = require('path')
  , hookio = require('hook.io');

var app = express();

exports.bootstrap = function(bootstrapDetails){
    return function(callback){
        //Application Configuration
        app.configure(function(){
          app.set('port', process.env.PORT || bootstrapDetails.port);
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
        app.bus = hookio.createHook({
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

        http.createServer(app).listen(app.get('port'), function(){
            console.log("FlowershopApp server listening on port " + app.get('port'));
            app.bus.on("hook::ready", function(){
                console.info("FLOWERSHOP APP BUS READY");
                callback(app);
            });
            app.bus.start();
        });
    };
};
