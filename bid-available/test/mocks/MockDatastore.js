module.exports = function(lt,lg,id){
    var ds = {
        'get': function(){
            return {
                number: "8018578530",
                coords: {'lat':lt,'long':lg},
                bid_radius: 50.0,
                id: id,
            };
        }
    };
    return ds;
};
