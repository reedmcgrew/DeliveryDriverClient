// Node tests

var buster = require("buster");
var testHook = require("./mocks/VanillaHook");
var sharedStore = require("../lib/SharedDatabase");


buster.testCase("The location update hook", {
    "inserts new coordinates": function (done) {
        //Set up data structures
        var dbOps = require('../operations/StorageOps');
        var lookupDriverInfo = dbOps.lookupDriverInfo(sharedStore);
        var storeDriverInfo = dbOps.storeDriverInfo(sharedStore);

        var locationUpdater = require("../hooks/location-update-hook").getHook(sharedStore);
        var fsid = 1001;
        var start_coords = {'lat':90.1,'long':90.1};
        var new_coords = {'lat':30.1,'long':30.1};
        storeDriverInfo(fsid, {coords:start_coords});

        //Perform event-based coordinate update
        locationUpdater.start();
        locationUpdater.on("hook::ready", function(){
            locationUpdater.on("*::foursquareUpdate",function(data){
                assert.equals(lookupDriverInfo(fsid).coords,new_coords);
                done();
            })
            testHook.on("hook::ready", function(){
                testHook.emit("foursquareUpdate",{'coords':new_coords,'fsid':fsid});
            });
            testHook.start();
        });
    }
});
