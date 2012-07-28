/**
 * Created with JetBrains WebStorm.
 * User: reed
 * Date: 7/28/12
 * Time: 2:03 PM
 * To change this template use File | Settings | File Templates.
 */
Buster.testCase("The driver application", {
"receives external rfq::bid_accepted events": function(done){
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
    var bootstrapDriverApplication = require('../operations/bootstrapDriverApplication')(bus,store,serverDetails,flowershopEsl);

    //Expected Data
    var deliveryId = 674345351;
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
        driver: {
            id: 22,
            coords: {'lat':70.3,'long':70.6}
        }
    };

    console.info("Bootstrapping delivery ready test instance.");
    bootstrapDriverApplication(function(DriverApp){
        console.info("DELIVERY READY TEST INSTANCE DONE BOOTSTRAPPING.");
        //Listen for delivery-ready internal event
        DriverApp.bus.on("delivery-ready",function(data){
            //Ensure that the data on the delivery-ready internal event matches that sent to the esl demuxer.
            console.info("DATA:");
            console.info(data);
            assert.equals(expectedDeliveryData,data);
            //Ensure that the delivery info is stored in the shared store.
            assert.equals(expectedDeliveryData.delivery,DriverApp.store.get('deliveries',deliveryId));
            done();
        });
        //Hit the esl demuxer with a rfq::delivery-ready event
        var headers = {
            method: "POST",
            url: DriverApp.getDriverEslBase() + expectedDeliveryData.driver.id,
            json: {
                '_domain': 'rfq',
                '_name': 'delivery-ready',
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
