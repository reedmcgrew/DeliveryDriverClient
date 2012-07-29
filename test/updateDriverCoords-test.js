var buster = require("buster");
var testHook = require("./../models/VanillaHook");
var sharedStore = require("../lib/SharedDatabase");
var HookIo = require('hook.io');


buster.testCase("The location update hook", {
    "inserts new coordinates": function (done) {
        //Set up data structures
        var dbOps = require('../operations/data/StorageOps');
        var lookupDriverInfo = dbOps.lookupDriverInfo(sharedStore);
        var storeDriverInfo = dbOps.storeDriverInfo(sharedStore);
        var updateDriverCoords = require('../operations/data/updateDriverCoords')(sharedStore);

        var fsid = 1001;
        var start_coords = {'lat':90.1,'long':90.1};
        var new_coords = {'lat':30.1,'long':30.1};
        storeDriverInfo(fsid, {coords:start_coords});

        //Perform event-based coordinate update
        var receiverHook = HookIo.createHook({
           name:"receiverHook"
        });
        testHook.on("hook::ready", function(){
           receiverHook.on("hook::ready", function(){
               testHook.on("*::foursquareUpdate", function(data){
                    updateDriverCoords(data.fsid,data.coords);
               });
               testHook.on("*::foursquareUpdate",function(data){
                    assert.equals(lookupDriverInfo(fsid).coords,new_coords);
                    done();
                });
                receiverHook.emit("foursquareUpdate",{'coords':new_coords,'fsid':fsid});
           });
        });
        testHook.start();
        receiverHook.start();
    }
});
