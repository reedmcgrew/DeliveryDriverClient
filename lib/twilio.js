var request = require('request');
var querystring = require('querystring');

/*
 @argument options An object literal with the following structure:

 {
 "sID"       : "",
 "authToken" : "",
 "sendUrl"   : '',
 "from"      : ''
 }

 */
var Twilio = module.exports = function(settings){
    return {
        'send': function(smsOptions,callback){
            //Prep post body
            var postJson = {
                'From':settings.from,
                'To':smsOptions.number,
                'Body':smsOptions.message,
            };
            var postBody = querystring.stringify(postJson);

            //Prep headers
            var postHeaders = {
                'Authorization': "Basic " + new Buffer(settings.sID + ':' + settings.authToken).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
            };

            //Send post request
            request.post({uri:settings.sendUrl,body:postBody,headers:postHeaders},function(e,r,body){
                console.log(e);
                console.log(body);
                callback(body);
            });
        },
    };
};
