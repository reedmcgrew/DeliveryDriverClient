/**
 * Created with JetBrains WebStorm.
 * User: reed
 * Date: 7/29/12
 * Time: 7:42 PM
 * To change this template use File | Settings | File Templates.
 */
var FoursquareUser = module.exports = function(client,datastore,checkins,info){
    var _client = client ? client : null;
    var _datastore = datastore ? datastore : null;
    var _id = null;

    var _checkins = checkins ? checkins : null;
    var _info = checkins ? checkins: null;

    var prep_checkins = function(json){
        var raw_checkins = json.response.checkins.items
        var prepped_checkins = new Array();
        for(var idx = 0; idx < raw_checkins.length; idx++){
            var checkin = raw_checkins[idx];
            var prepped_item = {
                id: checkin.id,
                created: checkin.createdAt,
                message: checkin.shout,
                venue: checkin.venue.name,
                city: checkin.venue.location.city,
                state: checkin.venue.location.state,
                postal: checkin.venue.location.postalCode
            };
            prepped_checkins.push(prepped_item);
        }
        return prepped_checkins;
    };

    return {
        'save':function(){
            _datastore.put('drivers',_id,{'id':_id,
                'checkins':_checkins,
                'info':_info});
        },
        'getId':function(){
            return _id;
        },
        'getCheckins':function(callback){
            _client.checkins(function(checkins){
                _checkins = prep_checkins(checkins);
                callback(_checkins);
            });
        },
        'getInfo':function(callback){
            _client.info(function(info){
                //*********************************Do pre-processing
                _info = {
                    "name":info["response"]["user"]["firstName"] + " " +
                        info["response"]["user"]["lastName"],
                    "id":info["response"]["user"]["id"],
                    "pic_url":info["response"]["user"]["photo"],
                };

                _id = _info.id;
                callback(_info);
            });
        },
        'setFoursquareClient':function(client){
            _client = client;
        },
        'setDatastore':function(datastore){
            _datastore = datastore;
        },
    }
};
