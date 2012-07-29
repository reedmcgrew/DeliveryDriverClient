/**
 * Created with JetBrains WebStorm.
 * User: reed
 * Date: 7/28/12
 * Time: 2:03 PM
 * To change this template use File | Settings | File Templates.
 */
Buster = require('buster');
HookIo = require('hook.io');
Buster.testCase("The driver application", {
"receives external rfq::bid-accepted events": function(done){
    var serverDetails = {
        port: 4444,
        host: "localhost"
    };

    //Bootstrap the driver app on localhost
    var store = require("../lib/Database")();
    var bus = HookIo.createHook({
        name:"recvDeliveryReady"
    });
    bus.bootstrap = function(callback){
        bus.on("hook::ready",function(){
            callback();
        });
        bus.start();
    };

    var flowershopEsl = "";
    var bootstrapDriverApplication = require('../operations/startDriverWebLayer')(bus,store,serverDetails,flowershopEsl);

    //Expected Data
    var deliveryId = 45667431;
    var expectedDeliveryData = {
        delivery: {
            id: deliveryId,
            addr: "100 S 300 E, Benjamin, UT, 88888",
            deliveryTime: "8pm"
        },
        flowershop: {
            name: "The flowery shop",
            coords: {'lat':70.2,'long':70.5}
        },
        driverId: 22
    };

    bootstrapDriverApplication(function(DriverApp){
        //Listen for delivery-ready internal event
        DriverApp.bus.on("bid-accepted",function(data){
            //Ensure that the data on the delivery-ready internal event matches that sent to the esl demuxer.
            assert.equals(expectedDeliveryData,data);
            done();
        });
        //Hit the esl demuxer with a rfq::delivery-ready event
        var headers = {
            method: "POST",
            url: DriverApp.getDriverEslBase() + expectedDeliveryData.driverId,
            json: {
                '_domain': 'rfq',
                '_name': 'bid-accepted',
                'data': expectedDeliveryData
            }
        };
        console.log("Driver ESL Base: " + headers.url);
        var request = require('request');
        request(headers, function(e,r,body){
        });
    });
}

/*"receives external rfq::bid_accepted events": function(done){
 //Hit the esl demuxer with a bid_accepted event and ensure that it fires off an internal delivery-ready event.
 assert(false);
 done();
 },*/
});
