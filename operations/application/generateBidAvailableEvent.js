/**
 * Created with JetBrains WebStorm.
 * User: reed
 * Date: 7/28/12
 * Time: 10:35 AM
 * To change this template use File | Settings | File Templates.
 */
var generateBidAvailableEvent = module.exports = function(eventEmitter){
    return function(deliveryId,driverId,driverCoords,distanceFromShop){
        console.info("Generating bid-available event");
        var data = {
            'deliveryId': deliveryId,
            'driverId': driverId,
            'driverCoords': driverCoords,
            'distanceFromShop': distanceFromShop
        };
        eventEmitter.emit("bid-available",data);
    };
};


