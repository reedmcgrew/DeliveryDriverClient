var geoCalc = require('./lib/GeodesicCalculator');
var hookio = require('hook.io');
var geoDist = function(coords1,coords2){
	return geoCalc(coords1.lat,coords1.long,coords2.lat,coords2.long);
};


var delivery_num = 0;
exports.getHook = function(datastore){	
	var bid_hook = hookio.createHook({
        name:"bid-hook",
	});

    bid_hook.on('hook::ready', function(){
        bid_hook.on('*::delivery_ready',function(data){
            var driver = datastore.get('drivers',data.driver_id);
            var flowershop = data.flowershop;
            var distance = geoDist(driver.coords,flowershop.coords);
            // If the driver is within n miles of the flower shop, submit a bid automatically to the flower shop and send the driver an SMS notification about the details of the bid.
            if(distance <= driver.bid_radius){			
                var send_short_delivery = {
                    number: driver.number,
                    message: "Bid sent to "+flowershop.name+" at a distance of "+distance+" for delivery to "+data.delivery.addr
                };
                bid_hook.emit('sendSms',send_short_delivery);
                bid_hook.emit('bid_available',driver);
            }
            // If the driver is outside that radius, then the bid can't be processed automatically.
            else{
                //Intiate listener for bid response
                var has_fired = false;
                var cur_delivery_num = delivery_num;
                bid_hook.once('*::recvSms::'+driver.number, function(data){
                    var bid_accepted = data.message.toLowerCase().indexOf("bid "+cur_delivery_num) != -1 
                    if(bid_accepted && !has_fired){
                        has_fired = true;
                        bid_hook.emit('bid_available',driver);
                    }
                });

                //Send off SMS to driver
                var send_long_delivery = {
                    number: driver.number,
                    message: "Delivery request from "+flowershop.name+
                            " at a distance of "+distance+" for delivery to "+data.delivery.addr+
                            ". Reply \"bid "+delivery_num+"\" to bid."
                };
                delivery_num++;
                bid_hook.emit('sendSms',send_long_delivery);
            }
        });
    });

	return bid_hook;
};
