var datastore = require('./mocks/MockDatastore')(90,90,1);
var bid_avail_hook = require('../bid-available').getHook(datastore);

var initTestHook = function(){
    var hookio = require('hook.io');
    var hook = hookio.createHook({
        name:'testhook',
    });
    hook.on('hook::ready',function(){
        hook.on('bid-hook::sendSms', function(data){
            console.info("---sendSMS---");
            console.info(data);
        });

        hook.on('bid-hook::recvSms', function(data){
            console.info("---recvSMS---");
            console.info(data);
        });

        setInterval(function(){hook.emit('delivery_ready',{
            driver_id: 1,
            flowershop: {
              name: "Hello Shop",
              coords: {lat:30.5,'long':30.5},
            },
            delivery: {
              addr: "1101 W 200 S, Provo, UT, 84603",
              id: 23
            },
        })},5000);
    });
    return hook;
};

bid_avail_hook.start();
initTestHook().start();
