//Listens for event hook.emit("foursquareUpdate",{'coords':coords,'fsid':fsid});
var UseCases = require("../UseCases");


exports.getHook = function(datastore){
    var lookupDriverInfo = UseCases.lookupDriverInfo(datastore);
    var storeDriverInfo = UseCases.storeDriverInfo(datastore);
    var hookio = require('hook.io');
    var updaterHook = hookio.createHook({
        name: "location-update",
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
