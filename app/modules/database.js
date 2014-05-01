var mysql = require('mysql');
var config = require('../../config/config');

/**
 * Start the database connection
 * @param [callback]
 */
function openPool(callback){
    if(!config.db){
        throw new Error('Database connection not initialized');
    }

    // Connect to DB server
    var pool = mysql.createPool(config.db);

    // Start the first connection
    pool.getConnection(function(err){
        if(err){
            throw new Error('DB Failed to connect: ', err);
        } else {
            console.log('Connected to DB');
        }

        if(typeof callback === 'function'){
            callback();
        }
    });

    return pool;
}


module.exports = function(callback){
    return module.exports = openPool(callback);
};