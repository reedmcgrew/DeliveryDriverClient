var hookio = require('hook.io');
var settings = require('./settings');
var twilioOptions = settings.twilio;
console.info(twilioOptions);
var twilio = require('./lib/twilio')(twilioOptions);

var twiliohook = hookio.createHook({ 
  "name": "twiliohook",
});

twiliohook.on('hook::ready', function(){
    twiliohook.on('*::sendSms', function(data){
        console.log('Received Data!');
        console.info(data);
        //twilio.send({'number':data.number,'message':data.message,function(error,data){
        //    console.log("Message sent to " + number + ".");
        //});
    });
});

twiliohook.start();
