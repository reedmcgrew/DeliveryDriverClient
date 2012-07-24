var m = Math;
var toRadians = function(degs){
    return degs*(1.0/180.0)*Math.PI;
};

var halversineFormula = function(lt1,lg1,lt2,lg2){
    var lat1 = toRadians(lt1);
    var lat2 = toRadians(lt2);
    var long1 = toRadians(lg1);
    var long2 = toRadians(lg2);

    var d_lat = lat2-lat1;
    var d_long = long2-long1;
    var t1 = m.pow(m.sin(d_lat/2.0), 2);
    var t2 = m.cos(lat1)*m.cos(lat2)*m.pow(m.sin(d_long/2.0),2);
    var sqrt = m.sqrt(t1+t2);
    return 2*m.asin(sqrt);
};

var geoDistance = module.exports = function(lat1,long1,lat2,long2){
    var r_earth_miles = 3959.0;
    var d = r_earth_miles*halversineFormula(lat1,long1,lat2,long2);
    return d;
};
