/**
 * Created with JetBrains WebStorm.
 * User: reed
 * Date: 7/28/12
 * Time: 10:37 AM
 * To change this template use File | Settings | File Templates.
 */
var signalRemoteEvent = require('./signalRemoteEvent');
var listenForBidAvailableEvent = module.exports = function(bus,eslBase){
    console.info("Adding listener for bid_available");
    bus.on("*::bid_available",function(data){
        var domain = 'rfq';
        var name = 'bid-available';
        var url = eslBase+data.deliveryId;
        console.info(data);
        console.info(url);
        signalRemoteEvent(domain,name,url,data,function(err, statusCode){
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

