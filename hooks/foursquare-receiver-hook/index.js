// Module Dependencies
var fsReceiverHook = require('./hook');
var http = require('http');


module.exports = function(port){
    var webserver = require('./webserver')(port);

    // Routes
    var routes = require('./routes');
    var receiverController = routes.createReceiver(fsReceiverHook);
    webserver.post('/', receiverController);

    // Combine hook and server
    fsReceiverHook.on('hook::ready', function(){
        http.createServer(webserver).listen(webserver.get('port'), function(){
            console.log("Foursquare Receiver listening on %d.", webserver.get('port'));
        });
    });
    return fsReceiverHook;
};



