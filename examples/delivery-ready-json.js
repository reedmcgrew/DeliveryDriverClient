/**
 * Created with JetBrains WebStorm.
 * User: reed
 * Date: 7/31/12
 * Time: 8:52 PM
 * To change this template use File | Settings | File Templates.
 */

var inRange = {
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

var bidAccepted = {
    "_name":"bid-accepted",
    "_domain":"rfq",
    "data":{
        "delivery":{
            "id":1234,
            "addr": "184 S 2000 E, Spanish Fork, UT, 84660"
        },
        "flowershop":{
            "coords":{"lat":70.1,"long":70.2},
            "addr": "286 W 300 N, Provo, UT, 84606",
            "name":"The Flower Patch"
        },
        "driverId":20407521
    }
};

var artificialTwilioResponse = {

};

var artificialFoursquareResponse = {

};
