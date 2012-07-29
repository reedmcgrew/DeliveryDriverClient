/**
 * Created with JetBrains WebStorm.
 * User: reed
 * Date: 7/28/12
 * Time: 7:58 PM
 * To change this template use File | Settings | File Templates.
 */
var composeDriverSite = module.exports = function(settings){
    //Settings
    var shopEslBase = settings.flowershopEslBase || "https://localhost:4444/deliveries/";
    var webLayerDetails = settings.webLayerDetails || {port: 5555, host: "localhost"};
    var twilioDetails =
        settings.twilioDetails ||
        {"sID"       : "",
        "authToken" : "",
        "sendUrl"   : '',
        "from"      : ''}
    var fsReceiverPort = settings.fsReceiverPort || 443;
    var twilioReceiverPort = settings.twilioReceiverPort || 3333;

    //Common components
    var datastore = require('../lib/SharedDatabase');
    var bus = require('../models/VanillaHook');
    var twilio = require('../lib/twilio')(twilioDetails);

    //Configure Application Layer Boundary
    require('./application/defineApplicationLayerBoundary')(bus,datastore,twilio);

    //Configure web and hook components
    var startWebLayer = require('./distribution/startDriverWebLayer')(bus,datastore,webLayerDetails,shopEslBase);
    var fsReceiver = require('../hooks/foursquare-receiver-hook')(fsReceiverPort);
    var twilioReceiver = require('../hooks/twilio-receiver-hook')(twilioReceiverPort);

    var distributedDriverSite = {
        'bus': bus,
        'twilioReceiver': twilioReceiver,
        'foursquareReicever': fsReceiver,
        'start': function(){
            startWebLayer(function(webLayerServer){
                twilioReceiver.start();
                fsReceiver.start();
            });
        }
    };

    return distributedDriverSite;
};
