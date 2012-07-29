/**
 * Created with JetBrains WebStorm.
 * User: reed
 * Date: 7/28/12
 * Time: 9:09 PM
 * To change this template use File | Settings | File Templates.
 */
var dbOps = require("../operations/StorageOps");

var updateDriverCoords = module.exports = function(datastore){
    var lookupDriverInfo = dbOps.lookupDriverInfo(datastore);
    var storeDriverInfo = dbOps.storeDriverInfo(datastore);
    return function(fsid,coords){
        var driverInfo = lookupDriverInfo(fsid);
        driverInfo.coords = coords;
        storeDriverInfo(fsid,driverInfo);
    };
}
