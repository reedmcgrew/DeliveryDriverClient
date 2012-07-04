exports.createReceiver = function(hook){
    return function(req,res){
        var payload = req.query;
        console.log("Received request:");
        console.log(payload);
        hook.emit("recvSms",{message:payload.Body,from:payload.From});
        res.send(200);
    };
};

