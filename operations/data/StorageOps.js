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

