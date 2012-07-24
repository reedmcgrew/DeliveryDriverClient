//Listens for event hook.emit("foursquareUpdate",{'coords':coords,'fsid':fsid});

exports.getHook = function(datastore){
    var hookio = require('hook.io');
    var updaterHook = hookio.createHook({
        name: "location-update",
    });

    //on foursquareUpdate
        //retrieve the driver by fsid
        //upsert new coordinates into the driver object
        //upsert the driver object into the datastore

    //New work created for the web layer:
        //Make the internal driver id identical to the fsid

    return updaterHook;
};
