/**
 * Created with JetBrains WebStorm.
 * User: reed
 * Date: 7/28/12
 * Time: 12:49 PM
 * To change this template use File | Settings | File Templates.
 */
var buster = require("buster");

buster.testCase("The bid-available hook", {
    "responds to regular in-range delivery-ready events": function(done){
        //Set up test data and fixtures
        var driverCoords = {'lat':90,'long':90}
        var driverId = 1;
        var shop = {
            name: "Hello Shop",
            coords: {lat:90.1,'long':90.1}
        };
        var delivery = {
            addr: "1101 W 200 S, Provo, UT, 84603",
            id: 23
        };

        var expectedData = {
            driver: {
                number: '8018578530',
                coords: driverCoords,
                bid_radius: 50,
                id: driverId },
            flowershop: shop,
            distance_from_shop: 6.909758508645121,
            'delivery': delivery};


        var datastore = require('./mocks/MockDatastore')(driverCoords.lat,driverCoords.long,driverId);
        var HookIo = require('hook.io');
        var hook = HookIo.createHook({
            name:'testhook2'
        });
        var respondWithBid = require('../operations/application/respondWithBid')(hook);

        //Listen for completed setup
        hook.on('hook::ready',function(){
            //Listen for bid-available actuation
            hook.on('bid-available',function(data){
                assert.equals(expectedData,data);
                done();
            });

            //Respond with bid when delivery ready comes in
            hook.on('delivery-ready', function(data){
                respondWithBid(data.delivery,data.flowershop,datastore.get('drivers',data.driverId));
            });

            //Kick-off mock delivery-ready event
            hook.emit('delivery-ready',{
                driver_id: driverId,
                flowershop: shop,
                delivery: delivery
            });
        });

        //Execute test
        hook.start();
    }
});


