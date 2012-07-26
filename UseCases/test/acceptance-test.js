// Node tests
var buster = require("buster");
var testHook = require("./mocks/VanillaHook");
var UseCases = require("../index");
var SubOps = require("../DriverApp/SubOps");
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

    /*"receives external rfq::delivery_ready events": function(done){
        //Bootstrap the driver app on localhost
        var store = requireI("../../lib/Database")();
        var bus = hookio.createHook({
            name:"recvDeliveryReady",
        });
        var flowershopEsl = "";
        bootstrapDriverApplication = UseCases.bootstrapDriverApplication(bus,store,flowershopEsl);

        //Expected Data
        var expectedDeliveryData = {};        

        bootstrapDriverApplication(function(DriverApp){
            //Listen for delivery_ready internal event
            DriverApp.bus.on("delivery_ready",function(data){
                //Ensure that the data on the delivery_ready internal event matches that sent to the esl demuxer.
                //Ensure that the delivery info is stored in the shared store.
            assert.equal
            //Hit the esl demuxer with a rfq::delivery_ready event and ensure that it fires off an internal delivery_ready event.
            done();
        });
    },

    "receives external rfq::bid_accepted events": function(done){
        //Hit the esl demuxer with a bid_accepted event and ensure that it fires off an internal delivery_ready event.
        assert(false);
        done();
    },*/

    "generates internal delivery_ready events": function(done){
        var genDREvents = hookio.createHook({
            name: "genDR",
        });
        var generateDeliveryReadyEvent = SubOps.generateDeliveryReadyEvent(genDREvents);
        genDREvents.on("hook::ready", function(){

            var expectedData = {
                delivery: {
                    id: 12345,
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
            genDREvents.on("delivery_ready", function(data){
                assert.equals(expectedData, data);
                done();
            });

            generateDeliveryReadyEvent(expectedData.delivery,expectedData.flowershop,expectedData.driver);
        });
        genDREvents.start();
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
                var generateBidAvailableEvent = SubOps.generateBidAvailableEvent(genHook);

                genHook.on("hook::ready", function(){
                    var bidData = {
                        'deliveryId': deliveryId,
                        'driverId': driverId,
                        'driverCoords': {'lat':30.3,'long':40.2},
                        'distanceFromShop': 56.2
                    };
                    //Test listener fixtures
                    driverApp.bus.on("*::bid_available", function(data){
                        assert.equals(bidData,data);
                    });
                    //driver app posts rfq::bid-available to flowershop app
                    driverApp.bus.on("external_event_sent", function(data){
                        //post results in 200 OK
                        assert.equals("rfq::bid-available", data.externalEventName);
                        assert.equals(200,data.responseCode);
                        done();
                    });


                    //flowershop app emits external-event-received
                    flowershopApp.bus.on("external-event-received", function(data){
                        //rfq::bid-available contains driverId, driverCoords
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
