/**
 * Created with JetBrains WebStorm.
 * User: reed
 * Date: 7/28/12
 * Time: 10:34 AM
 * To change this template use File | Settings | File Templates.
 */
var generateDeliveryReadyEvent = module.exports = function(bus){
    return function(delivery,flowershop,driver){
        console.info("Generating bid accepted event");
        //delivery
        //id
        //addr
        //deliveryTime
        //flowershop
        //name
        //coords
        //driver
        //id
        //coords
        var data = {
            'delivery': delivery,
            'flowershop': flowershop,
            'driver': driver
        };
        bus.emit("bid-accepted",data);
    };
};


