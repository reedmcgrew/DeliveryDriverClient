/**
 * Created with JetBrains WebStorm.
 * User: reed
 * Date: 7/29/12
 * Time: 7:46 PM
 * To change this template use File | Settings | File Templates.
 */
var foursquare_settings = require("../settings.js").foursquare;
console.log("FOURSQUARE SETTINGS:");
console.info(foursquare_settings);
Foursquare = require("node-foursquare-2")(foursquare_settings);
module.exports = Foursquare;
