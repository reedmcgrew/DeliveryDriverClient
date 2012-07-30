/**
 * Created with JetBrains WebStorm.
 * User: reed
 * Date: 7/29/12
 * Time: 3:16 PM
 * To change this template use File | Settings | File Templates.
 */

var Buster = require('buster');
var Database = require('../lib/Database');
var StorageOps = require('../operations/data/StorageOps');
var LoginConstructor = require('../operations/application/logUserIn');

//Test Data
var driverId = 9387400039327;
var expectedData = {
    'coords': {'lat':30.4,'long':30.5},
    'name': "Reed McGrew",
    'bidRadius': 50,
    'number': 8018578530
};

Buster.testCase("The logUserIn operation",{
    "retrieves user id and latest coordinates from the datastore if User exists": function(){
        var store = Database();
        var storeDriver = StorageOps.storeDriverInfo(store);
        storeDriver(driverId,expectedData);
        var loginDriver = LoginConstructor(store);
        assert.equals(expectedData,loginDriver(driverId));
    }
});
