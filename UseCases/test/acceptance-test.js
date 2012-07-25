// Node tests
var buster = require("buster");
var testHook = require("./mocks/VanillaHook");
var UseCases = require("../index");
var hookio = require("hook.io");

//Test data
var mockFlowershopDetails = {
    'port': 3000,
    'host': 'localhost',
    'eslBaseRoute': 'deliveries',
};

var deliveryId = 102938;
var driverId = 107387455;
var expectedDeliveryInfo = {
    'addr': "100 S 200 E, Salt Lake City, UT, 84756",
    'flowershopCoords': {'lat':30.4,'long':30.5},
    'deliveryId': deliveryId,
    'driverId': driverId
};


//Tests
buster.testCase("The driver application", {
    "stores and retrieves delivery info.": function (done){
        var store = require("../../lib/Database")();
        var lookupDeliveryInfo = UseCases.lookupDeliveryInfo(store);
        var storeDeliveryInfo = UseCases.storeDeliveryInfo(store);
        var beforeInfo = lookupDeliveryInfo(deliveryId);
        assert.equals(beforeInfo, null);
        storeDeliveryInfo(deliveryId, expectedDeliveryInfo);
        var afterInfo = lookupDeliveryInfo(deliveryId);
        assert.equals(afterInfo, expectedDeliveryInfo);
        done();
    },

    "sends bid-available payloads to flowershop.": function(done){
        //driver hook mesh emits bid_available
        var bootstrapFlowershopApplication = require('./mocks/MockFlowershopApp').bootstrap(mockFlowershopDetails);
        bootstrapFlowershopApplication(function(flowershopApp){
            //Set up driver app operations
            var store = require("../../lib/Database")();
            var flowershopESL = flowershopApp.getFlowershopEslBase();
            var bootstrapDriverApplication = UseCases.bootstrapDriverApplication(testHook,store,flowershopESL);
            bootstrapDriverApplication(function(driverApp){
                //Set up internal bid-available operation
                var genHook = hookio.createHook({
                    name: "genHook",
                });
                var generateBidAvailableEvent = UseCases.generateBidAvailableEvent(genHook);

                genHook.on("hook::ready", function(){
                    var bidData = {
                        'deliveryId': deliveryId,
                        'driverId': driverId,
                        'driverCoords': {'lat':30.3,'long':40.2},
                        'distanceFromShop': 56.2
                    };
                    //Test listener fixtures
                    driverApp.bus.on("*::bid_available", function(data){
                        console.info("Driverapp bus just received bid available");
                        assert.equals(bidData,data);
                    });
                    //driver app posts rfq::bid-available to flowershop app
                    driverApp.bus.on("external_event_sent", function(data){
                        console.info("Driverapp bus just received external_event_sent");
                        //post results in 200 OK
                        console.info(data);
                        assert.equals("rfq::bid-available", data.externalEventName);
                        assert.equals(200,data.responseCode);
                        done();
                    });

                    //flowershop app emits external-event-received
                    flowershopApp.bus.on("external-event-received", function(data){
                        //rfq::bid-available contains driverId, driverCoords
                        console.info("flowershop bid avail received");
                        assert.equals(bidData,data);
                    });

                    generateBidAvailableEvent(
                        bidData.deliveryId,
                        bidData.driverId,
                        bidData.driverCoords,
                        bidData.distanceFromShop);
                });
                genHook.start();
            });
        });
    }
});
