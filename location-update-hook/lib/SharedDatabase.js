if(typeof(shared_database) == 'undefined'){
    var Database = require('./Database');
    shared_database = Database();
}

module.exports = shared_database;
