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
