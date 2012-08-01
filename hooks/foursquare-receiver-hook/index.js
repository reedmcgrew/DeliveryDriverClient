// Module Dependencies
var fsReceiverHook = require('./hook');
var http = require('http');


module.exports = function(port){
    var webserver = require('./webserver')(port);

    // Routes
    var routes = require('./routes');
    var receiverController = routes.createReceiver(fsReceiverHook);
    webserver.post('/', receiverController);
    webserver.get('*', function(req,res){
       res.send("You have reached the foursquare receiver endpoint", 200);
    });

    // Combine hook and server
    fsReceiverHook.on('hook::ready', function(){
        webserver.listen(port, function(){
            console.log("Foursquare Receiver listening on %d.", webserver.address().port);
        });
    });
    return fsReceiverHook;
};



