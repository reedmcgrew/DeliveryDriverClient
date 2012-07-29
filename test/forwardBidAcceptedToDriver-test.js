/**
 * Created with JetBrains WebStorm.
 * User: reed
 * Date: 7/28/12
 * Time: 2:19 PM
 * To change this template use File | Settings | File Templates.
 */

var Buster = require('buster');
var HookIo = require('hook.io');
var StorageOps = require('../operations/data/StorageOps');

Buster.testCase("The forwardBidAcceptedToDriver operation",{
    "forwards bid accepted internal events to the driver via SMS": function(done){
        //Set up bus and storage
        var bus = HookIo.createHook({
            name:'bidAcceptedSmsListener'
        });
        var datastore = require('../lib/Database')();
        var forwardBidAcceptedToDriver = require("../operations/application/forwardBidAcceptedToDriver")(bus,datastore);

        //Set up driver
        var driver = {
          number:8018578530,
          id:1239592
        };
        var storeDriver = StorageOps.storeDriverInfo(datastore);
        storeDriver(driver.id,driver);

        //Set up flowershop
        var shop = {
            name: "Hello Shop",
            addr: "134 Rio Grande Dr., Provo, UT, 84606"
        };

        //Set up delivery data
        var delivery = {
            addr: "1101 W 200 S, Provo, UT, 84603",
            id: 23,
            time: "8pm"
        };

        //Set up bid-accepted expected SMS data
        var expectedData = {
            number: 8018578530,
            message: "Bid Accepted\nFlowershop Addr: "+shop.addr+"\nDelivery Addr:"+delivery.addr+"\nDelivery Time:"+delivery.deliveryTime
        };


        //TEST SENDING OF SMS DATA
        bus.on("hook::ready",function(){
            bus.on("sendSms", function(data){
                console.info("RECEIVED sendSms");
                assert.equals(expectedData,data);
                done();
            });
            forwardBidAcceptedToDriver(delivery,shop,driver.id);
        });
        bus.start();
    }

});
