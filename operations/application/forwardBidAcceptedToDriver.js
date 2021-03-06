/**
 * Created with JetBrains WebStorm.
 * User: reed
 * Date: 7/28/12
 * Time: 2:16 PM
 * To change this template use File | Settings | File Templates.
 */

var forwardBidAcceptedToDriver = module.exports = function(bus,store){
    return function(delivery,shop,driverId){
        var lookupDriver = require('../data/StorageOps').lookupDriverInfo(store);
        var driver = lookupDriver(driverId);
        var expectedData = {
            number: driver.number,
            message: "Bid Accepted\nFlowershop Location: {"+shop.coords.lat+","+shop.coords["long"]+"}\nDelivery Addr:"+delivery.addr+"\nPickup Time:"+delivery.pickup
        };
        bus.emit("sendSms", expectedData);
    };
};
