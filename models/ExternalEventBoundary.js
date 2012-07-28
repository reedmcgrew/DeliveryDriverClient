/**
 * Created with JetBrains WebStorm.
 * User: reed
 * Date: 7/28/12
 * Time: 4:09 PM
 * To change this template use File | Settings | File Templates.
 */
var InboundEventBoundary = module.exports = function(bus){
    //Handle bid-accepted events
    bus.on('bid-accepted',function(data){
        forwardBidAcceptedToDriver(data.delivery,data.flowershop,data.driverId);
    });

    //Handle delivery-ready events
    bus.on('delivery-ready', function(data){
        respondWithBid(data.delivery,data.flowershop,data.driverId)
    });
};