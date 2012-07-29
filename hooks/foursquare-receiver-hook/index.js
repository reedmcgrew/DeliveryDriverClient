// TODO add injection of port
// TODO export hook as module
// Module Dependencies
var fsReceiverHook = require('./hook');
var webserver = require('./webserver');
var routes = require('./routes');

// Routes
var receiverController = routes.createReceiver(fsReceiverHook);
webserver.post('/', receiverController);

module.exports = function(port){
    // Combine hook and server
    fsReceiverHook.on('hook::ready', function(){
        webserver.listen(port, function(){
            console.log("Listening on %d.", webserver.address().port, webserver.settings.env);
        });
    });
    return fsReceiverHook;
};



