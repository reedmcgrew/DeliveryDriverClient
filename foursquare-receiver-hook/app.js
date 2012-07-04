// Module Dependencies
var settings = require('./settings');
var twilioReceiverHook = require('./hook');
var webserver = require('./webserver');
var routes = require('./routes');

// Routes
var receiverController = routes.createReceiver(twilioReceiverHook);
webserver.post('/', receiverController);

// Combine hook and server
twilioReceiverHook.on('hook::ready', function(){
    webserver.listen(settings.port, function(){
        console.log("Listening on %d.", webserver.address().port, webserver.settings.env);
    });
});
twilioReceiverHook.start();

