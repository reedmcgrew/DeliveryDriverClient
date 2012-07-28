/**
 * Created with JetBrains WebStorm.
 * User: reed
 * Date: 7/28/12
 * Time: 2:16 PM
 * To change this template use File | Settings | File Templates.
 */

var forwardBidAcceptedToDriver = module.exports = function(bus,store){
    return function(delivery,shop,driverId){
        var lookupDriver = require('../operations/StorageOps').lookupDriverInfo(store);
        var driver = lookupDriver(driverId);
        var expectedData = {
            number: driver.number,
            message: "Bid Accepted\nFlowershop Addr: "+shop.addr+"\nDelivery Addr:"+delivery.addr+"\nDelivery Time:"+delivery.deliveryTime
        };
        bus.emit("sendSms", expectedData);
    };
};
