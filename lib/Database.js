var _ = require('underscore');

module.exports = function(){
    var _data = {};
    return {
        'getAll': function(collection){
            if(_data.hasOwnProperty(collection)){
                return _.map(_data[collection],function(val,key){
                    return val;
                });
            }
            else return [];
        },
        'get': function(collection,id){
            if(_data.hasOwnProperty(collection)){
                var collection = _data[collection];
                if(collection.hasOwnProperty(id)){
                    return collection[id];
                }
            }
            return null;
        },
        'put': function(collection,id,obj){
            console.log(24);
            if(!_data.hasOwnProperty(collection)){
                console.log(26);
                _data[collection] = {};
            }
            console.log(29);
            _data[collection][id] = obj;
            console.log(31);
        },
    };
};
