/**
 * Created with JetBrains WebStorm.
 * User: reed
 * Date: 7/28/12
 * Time: 10:41 AM
 * To change this template use File | Settings | File Templates.
 */
var bootstrapDriverApplication = module.exports = function(bus,store,serverDetails,flowershopEslBase){
    var DriverApp = require('./../models/DriverApp');
    return DriverApp.bootstrapDriverApplication(bus,store,serverDetails,flowershopEslBase);
};

