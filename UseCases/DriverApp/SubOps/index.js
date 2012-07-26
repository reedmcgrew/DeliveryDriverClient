exports.signalRemoteEvent = function(domain,name,url,data,callback){
    var request = require('request');
    var headers = {
        'url': url,
        'method': 'POST',
        'json': {
            '_domain': domain,
            '_name': name,
            'data': data
        }
    };
    request(headers, function(err,response,body){
        console.log(url);
        callback(err,response.statusCode);
    });
};

exports.generateDeliveryReadyEvent = function(bus){
    return function(delivery,flowershop,driver){
        console.info("Generating delivery ready event");
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
        bus.emit("delivery_ready",data);

    };
};

//Event Operations
exports.generateBidAvailableEvent = function(eventEmitter){
    return function(deliveryId,driverId,driverCoords,distanceFromShop){
        console.info("Generating bid_available event");
        var data = {
            'deliveryId': deliveryId,
            'driverId': driverId,
            'driverCoords': driverCoords,
            'distanceFromShop': distanceFromShop
        };
        eventEmitter.emit("bid_available",data);
    };
};

exports.listenForBidAvailableEvent = function(bus,eslBase){
    console.info("Adding listener for bid_available");
    bus.on("*::bid_available",function(data){
        var domain = 'rfq';
        var name = 'bid-available';
        var url = eslBase+data.deliveryId;
        console.info(data);
        console.info(url);
        exports.signalRemoteEvent(domain,name,url,data,function(err, statusCode){
            var statusData = {
                'externalEventName':domain+"::"+name,
                'responseCode':statusCode
            };
            console.info("Sending external_event_sent");
            console.info(statusData);
            bus.emit("external_event_sent",statusData);
        });

    });
};
