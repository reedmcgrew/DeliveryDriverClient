var LoginConstructor = require('../../operations/application/logUserIn');
var StoreDriverConstructor = require('../../operations/data/StorageOps').storeDriverInfo;
exports.displayEsl = function(store,eslBase){
    return function(req,res){
        //Get the foursquareId from the session
        var login = LoginConstructor(store);
        var fsid = req.session.fsid;
        var user = login(fsid);
        if('number' in user && 'bidRadius' in user && 'coords' in user){
            //User has provided required info. Display unique ESL
            var esl = eslBase+fsid
            console.info("User logged in:");
            console.info(user);
            res.send("You successfully logged in using Foursquare.  Your unique ESL is:<br><br>" + esl,200);
        } else {
            //User has not provided required info.  Display account creation page.
            res.render('gatherInfo', { error: "", title: "Driver's Brokerage Site"});
        }
    }
};

exports.createHandler = function(store){
    return function(req,res){
        var data = req.body.user;
        var storeDriver = StoreDriverConstructor(store);
        var fsid = req.session.fsid;
        data.id = fsid;
        data.coords = {
            "lat":parseFloat(req.body.coords["lat"]),
            "long":parseFloat(req.body.coords["long"])
        };
        storeDriver(fsid,data);
        res.redirect('/');
    }
};

exports.authenticate = function(Foursquare,Datastore){
    return function(req, res){
        Foursquare.getAccessToken({code: req.query.code}, function (error, accessToken) {
            if(error) {
                res.send("An error was thrown: " + error.message);
            }
            else {
                // Save the accessToken and data, then redirect.
                console.log("ACCESS TOKEN: " + accessToken);
                console.log("ERROR: " + error);

                var FoursquareClient = require('../../models/FoursquareClient')(accessToken);
                var user = require('../../models/FoursquareUser')(FoursquareClient,Datastore);
                user.getInfo(function(){
                    req.session.accessToken = accessToken;
                    req.session.fsid = user.getId();
                    res.writeHead(303, { "location": "/" });
                    res.end();
                });
            }
        });
    };
};

exports.connect = function(Foursquare){
    return function(req, res, next){
        console.info("trying to connect");
        if('session' in req === false || 'accessToken' in req.session === false){
            console.info("connecting to foursquare");
            res.writeHead(303, { "location": Foursquare.getAuthClientRedirectUrl() });
            res.end();
        }
        else{
            console.info("already connect");
            next();
        }
    };
};

exports.driverEslHandler = function(bus,store){
    return function(req,res){
        console.info("Drivers Post Received: "+req.params.id);
        console.info(req.body);

        //Decode payload
        var body = req.body.data;
        var driverId = req.params.id;
        var data = {
            'delivery': body.delivery,
            'flowershop': body.flowershop,
            'driverId': driverId
        };

        //Pass events off to the internal bus
        var eventName = req.body._name;
        if(eventName === "delivery-ready"){
            //Generate explicit delivery ready event
            store.put('deliveries',data.delivery.id,data.delivery);
            bus.emit(eventName,data);
        }
        else if(eventName === "bid-accepted"){
            bus.emit(eventName,data);
        }

        //respond
        res.send(200);
    };
};