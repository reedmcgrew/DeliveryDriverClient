/**
 * Created with JetBrains WebStorm.
 * User: reed
 * Date: 7/29/12
 * Time: 3:45 PM
 * To change this template use File | Settings | File Templates.
 */

var LookupDriver = require('../data/StorageOps').lookupDriverInfo;
var StoreDriver = require('../data/StorageOps').storeDriverInfo;
module.exports = function(store){
    var lookup = LookupDriver(store);
    var store = StoreDriver(store);
    return function(fsid){
        var driverData = lookup(fsid);
        if(driverData === null){
            var driverSeed = {id:fsid};
            store('drivers',fsid,driverSeed);
            return driverSeed;
        } else {
            return driverData;
        }
    }
};
