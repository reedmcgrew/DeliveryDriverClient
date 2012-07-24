exports.lookupDriverInfo = function(datastore){
    return function(id){
        console.info(id);

        return datastore.get('drivers',id);
    };
};

exports.storeDriverInfo = function(datastore){
    return function(id, obj){
        console.info(id);
        console.info(obj);
        return datastore.put('drivers',id,obj);
    }
};

