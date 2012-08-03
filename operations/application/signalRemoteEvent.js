/**
 * Created with JetBrains WebStorm.
 * User: reed
 * Date: 7/28/12
 * Time: 10:33 AM
 * To change this template use File | Settings | File Templates.
 */
var signalRemoteEvent = module.exports = function(domain,name,url,data,callback){
    var request = require('request');
    var headers = {
        'url': url,
        'method': 'POST',
        'json': {
            '_domain': domain,
            '_name': name,
            'data': data
        }
    };
    request(headers, function(err,response,body){
        var statusCode = 500;
        if(typeof response !== "undefined"){
            statusCode = response.statusCode;
        }
        callback(err,statusCode);
    });
};
