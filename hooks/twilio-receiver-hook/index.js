// Module Dependencies
var twilioReceiverHook = require('./hook');
var http = require('http');

module.exports = function(port){
    var webserver = require('./webserver')(port);

    // Routes
    var routes = require('./routes');
    var receiverController = routes.createReceiver(twilioReceiverHook);
    webserver.get('/', receiverController);

    // Combine hook and server
    twilioReceiverHook.on('hook::ready', function(){
        http.createServer(webserver).listen(webserver.get('port'), function(){
            console.log("Twilio receiver webserver listening on %d.", webserver.get('port'));
        });
    });
    return twilioReceiverHook;
};
