exports.listenForBidAvailableEvent = function(bus){
    bus.on("*::bid_available",function(data){
        var statusData = {
            'externalEventName':'stuff',
            'responseCode':404
        };
        bus.emit("external_event_sent",statusData);
    });
};
