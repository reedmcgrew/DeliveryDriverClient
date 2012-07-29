// Module Dependencies
var twilioReceiverHook = require('./hook');
var webserver = require('./webserver');
var routes = require('./routes');

// Routes
var receiverController = routes.createReceiver(twilioReceiverHook);
webserver.get('/', receiverController);

module.exports = function(port){
    // Combine hook and server
    twilioReceiverHook.on('hook::ready', function(){
        webserver.listen(port, function(){
            console.log("Listening for HTTP on %d.", webserver.address().port, webserver.settings.env);
        });
    });
};

