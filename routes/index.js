var LoginConstructor = require('../operations/application/logUserIn');
exports.loginHandler = function(store,eslBase){
    return function(req,res){
        //Get the foursquareId from the session
        var login = LoginConstructor(store);
        var fsid = req.session.fsid;
        var user = login(fsid);

        var TEMPLATE = {
            user: user,
            esl: eslBase+fsid
        }
        res.send(TEMPLATE,200);
    }
};

exports.home = function(req, res){
    var token = null;
    if(req.session && req.session.accessToken)
        token = req.session.accessToken;
    console.log("TOKEN: " + token);
    var logged_in = token != null ? true : false;
    var all_users = database.getAll('users');
    res.render('home', { 'title': "Foursquare Check",
        'cur_id': req.session.cur_id,
        'logged_in': logged_in,
        'all_users': all_users,
        'users_datastring': JSON.stringify(all_users)});
};


exports.connect = function(req, res, next){
    if(req.session.accessToken == null){
        res.writeHead(303, { "location": Foursquare.getAuthClientRedirectUrl() });
        res.end();
    }
    else{
        res.redirect("/");
    }

};
//TODO Implement GET HTTPS Foursquare Auth Callback Handler
//TODO Implement Foursquare Auth middleware
//TODO Implement GET displaySignupHandler
//TODO Implement POST createAccountHandler
exports.createHandler = function(store){

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