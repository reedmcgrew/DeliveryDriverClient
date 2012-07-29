/**
 * Created with JetBrains WebStorm.
 * User: reed
 * Date: 7/29/12
 * Time: 12:58 PM
 * To change this template use File | Settings | File Templates.
 */

var settings = require('../settings');
var driverSite = require('./composeDriverSite')(settings);
driverSite.start();