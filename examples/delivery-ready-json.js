/**
 * Created with JetBrains WebStorm.
 * User: reed
 * Date: 7/31/12
 * Time: 8:52 PM
 * To change this template use File | Settings | File Templates.
 */

var inRange =
{
    "_name":"delivery-ready",
    "_domain":"rfq",
    "data":{
        "delivery":{
            "id":1234,
            "addr": "184 S 2000 E, Spanish Fork, UT, 84660"
        },
        "flowershop":{
            "coords":{"lat":30.1,"long":30.2},
            "name":"The Flower Patch"
        }
    }
};

var outOfRange = {
    "_name":"delivery-ready",
    "_domain":"rfq",
    "data":{
        "delivery":{
            "id":1234,
            "addr": "184 S 2000 E, Spanish Fork, UT, 84660"
        },
        "flowershop":{
            "coords":{"lat":20.1,"long":40.2},
            "name":"The Flower Patch"
        }
    }
};

var artificialTwilioResponse = {

};

var artificialFoursquareResponse = {

};
