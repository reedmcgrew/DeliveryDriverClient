/**
 * Created with JetBrains WebStorm.
 * User: reed
 * Date: 7/28/12
 * Time: 8:58 PM
 * To change this template use File | Settings | File Templates.
 */
var sendSms = module.exports = function(twilio){
    return function(number,message){
        twilio.send({'number':number,'message':message},function(error,data){
            console.log("Message sent to " + number + ".");
        });
    };
};
