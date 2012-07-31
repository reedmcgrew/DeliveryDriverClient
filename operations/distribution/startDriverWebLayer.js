/**
 * Created with JetBrains WebStorm.
 * User: reed
 * Date: 7/28/12
 * Time: 10:41 AM
 * To change this template use File | Settings | File Templates.
 */
var startDriverWebLayer = module.exports = function(bus,store,serverDetails,flowershopEslBase){
    var DriverWebLayer = require('./../../weblayer/DriverWebLayer');
    return DriverWebLayer.startDriverWebLayer(bus,store,serverDetails,flowershopEslBase);
};

