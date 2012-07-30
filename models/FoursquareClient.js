/**
 * Created with JetBrains WebStorm.
 * User: reed
 * Date: 7/29/12
 * Time: 7:44 PM
 * To change this template use File | Settings | File Templates.
 */
var request = require('request');

var FoursquareClient = module.exports = function(token){
    var _accessToken = token;

    var call = function(path,callback){
        var api_path = "https://api.foursquare.com/v2/";
        var api_version = "20120201";
        var call_string = api_path +
            path +
            "?oauth_token=" + _accessToken +
            "&v=" + api_version;

        request(call_string, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                callback(JSON.parse(body));
            }
            else{
                callback(error);
            }
        });
    };

    return {
        'checkins':function(callback){
            call("users/self/checkins",function(data){
                callback(data);
            });
        },
        'info':function(callback){
            call("users/self",function(data){
                callback(data);
            });
        }
    };
};
