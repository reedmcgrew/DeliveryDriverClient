// TODO Allow injection of bus mechanism (decouple from Hook.io)
var geoCalc = require('./../lib/GeodesicCalculator');
var geoDist = function(coords1,coords2){
	return geoCalc(coords1.lat,coords1.long,coords2.lat,coords2.long);
};


var delivery_num = 0;
var respondWithBid = module.exports = function(bus){
    return function(delivery,flowershop,driver) {
        var distance = geoDist(driver.coords,flowershop.coords);
        // If the driver is within n miles of the flower shop, submit a bid automatically to the flower shop and send the driver an SMS notification about the details of the bid.
        if (distance <= driver.bid_radius) {
            var send_short_delivery = {
                number:driver.number,
                message:"Bid sent to " + flowershop.name + " at a distance of " + distance + " for delivery to " + delivery.addr
            };
            bus.emit('sendSms', send_short_delivery);
            var payload = {'driver':driver, 'delivery':delivery, 'flowershop':flowershop, 'distance_from_shop':distance};
            bus.emit('bid-available', payload);
        }
        // If the driver is outside that radius, then the bid can't be processed automatically.
        else {
            //Intiate listener for bid response
            var has_fired = false;
            var cur_delivery_num = delivery_num;
            bus.once('recvSms::' + driver.number, function (data) {
                var bid_accepted = data.message.toLowerCase().indexOf("bid " + cur_delivery_num) != -1
                if (bid_accepted && !has_fired) {
                    has_fired = true;
                    var payload = {'driver':driver, 'delivery':delivery, 'flowershop':flowershop, 'distance_from_shop':distance};
                    bus.emit('bid-available', payload);
                }
            });
            //Send off SMS to driver
            var send_long_delivery = {
                number:driver.number,
                message:"Delivery request from " + flowershop.name +
                    " at a distance of " + distance + " for delivery to " + delivery.addr +
                    ". Reply \"bid " + delivery_num + "\" to bid.",
                'deliveryNum':delivery_num
            };
            delivery_num++;
            bus.emit('sendSms', send_long_delivery);
        }
    }
};
