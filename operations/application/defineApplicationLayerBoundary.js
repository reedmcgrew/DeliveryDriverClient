/**
 * Created with JetBrains WebStorm.
 * User: reed
 * Date: 7/28/12
 * Time: 4:09 PM
 * To change this template use File | Settings | File Templates.
 */
var settings = require('../../settings');
var defineApplicationLayerBoundary = module.exports = function(bus, store, twilio){
    //Configure Sub-Operations
    fowardBidAcceptedToDriver = require('./forwardBidAcceptedToDriver')(bus,store);
    respondWithBid = require('./respondWithBid')(bus,store);
    sendSms = require('./sendSms')(twilio);
    updateDriverCoords = require('./../data/updateDriverCoords')(store);

    //Handle internal bid-accepted events
    bus.on('bid-accepted',function(data){
        fowardBidAcceptedToDriver(data.delivery,data.flowershop,data.driverId);
    });

    //Handle internal delivery-ready events
    bus.on('delivery-ready', function(data){
        console.info("delivery-ready received!")
        console.info(data);
        respondWithBid(data.delivery,data.flowershop,data.driverId)
    });

    //Handle internal smsSends
    bus.on('sendSms', function(data){
        console.info("I'm supposed to send this SMS message:");
        console.info(data);
        sendSms(data.number,data.message);
    });

    //Handle coordinate updates from the FoursquareReceiver hook
    bus.on("*::foursquareUpdate", function(data){
        updateDriverCoords(data.fsid,data.coords);
    });
};
