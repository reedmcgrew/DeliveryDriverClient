// Node tests
var buster = require("buster");
var testHook = require("./mocks/VanillaHook");
var sharedStore = require("./lib/SharedDatabase");
var UseCases = require("../../UseCases");
var lookupDriverInfo = UseCases.lookupDriverInfo(sharedStore);
var storeDriverInfo = UseCases.storeDriverInfo(sharedStore);

buster.testCase("A module", {
    "it inserts new coordinates": function () {
        var locationUpdater = require("../location-update-hook").getHook(shared_store);
        locationUpdater.start();
        locationUpdater.on("hook::ready", function(){
            locationUpdater.on("foursquareUpdate",function(data){
                assert.equals
            })
            testHook.emit

        });
    }
});
