//Listens for event hook.emit("foursquareUpdate",{'coords':coords,'fsid':fsid});
var dbOps = require("../operations/StorageOps");


exports.getHook = function(datastore){
    var lookupDriverInfo = dbOps.lookupDriverInfo(datastore);
    var storeDriverInfo = dbOps.storeDriverInfo(datastore);
    var HookIo = require('hook.io');
    var updaterHook = HookIo.createHook({
        name: "location-update"
    });

    updaterHook.on("hook::ready", function(){
        //on foursquareUpdate
        updaterHook.on("*::foursquareUpdate", function(data){
            var driverInfo = lookupDriverInfo(data.fsid);
            driverInfo.coords = data.coords;
            storeDriverInfo(driverInfo);
        });
    });
    //New work created for the web layer:
        //Make the internal driver id identical to the fsid

    return updaterHook;
};
