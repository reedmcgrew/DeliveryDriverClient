//Database Operations
exports.lookupDriverInfo = function(datastore){
    return function(id){
        return datastore.get('drivers',id);
    };
};

exports.storeDriverInfo = function(datastore){
    return function(id, obj){
        return datastore.put('drivers',id,obj);
    }
};

exports.storeDeliveryInfo = function(datastore){
    return function(id, obj){
        return datastore.put('drivers',id,obj);
    }
};

exports.lookupDeliveryInfo = function(datastore){
    return function(id){
        var result = datastore.get('drivers',id);
        return result;
    }
};

//Top-level operations
exports.bootstrapDriverApplication = function(bus,store,flowershopEslBase){
    var DriverApp = require('./DriverApp');
    return DriverApp.bootstrap(bus,store,flowershopEslBase);
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

exports.listenForBidAvailableEvent = function(bus){
    bus.on("*::bid_available",function(data){
        var statusData = {
            'externalEventName':'stuff',
            'responseCode':404
        };
        bus.emit("external_event_sent",statusData);
    });
};
