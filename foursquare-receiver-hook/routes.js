exports.createReceiver = function(hook){
    return function(req,res){
        //Coordinates
        var checkin = JSON.parse(req.body.checkin);
        var loc = checkin.venue['location'];
        var coords = {'latitude':loc.lat,'longitude':loc.lng};

        //Foursquare Id
        var user = JSON.parse(req.body.user);
        var fsid = user.id;

        //Debug Output
        console.log("Location:");
        console.log(coords);
        console.log("User Id:");
        console.log(fsid);
       
        hook.emit("foursquareUpdate",{'coords':coords,'fsid':fsid});
        res.send(200);
    };
};

