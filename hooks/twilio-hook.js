var hookio = require('hook.io');
var Twilio = require('../lib/Twilio');
// TODO re-structure this hook to allow dependency injection of the hook and the Twilio library
// TODO write a test for this module

/*
    @argument twilioOptions An object literal with the following structure:

    {
        "sID"       : "",
        "authToken" : "",
        "sendUrl"   : '',
        "from"      : ''
    }

*/
exports.getHook = function(twilioOptions){
    var twilio = Twilio(twilioOptions);
    var twiliohook = hookio.createHook({
        "name": "twiliohook"
    });

    twiliohook.on('hook::ready', function(){
        twiliohook.on('*::sendSms', function(data){
            console.log('Received Data!');
            console.info(data);
            twilio.send({'number':data.number,'message':data.message},function(error,data){
                console.log("Message sent to " + number + ".");
            });
        });
    });

    return twiliohook;
};
