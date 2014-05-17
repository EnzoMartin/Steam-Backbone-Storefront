var config = require('../../config/config');

module.exports = function(callback){
    // Connect to DB server
    var url = config.cloudant_url.replace('user',config.cloudant_user).replace('password',config.cloudant_password);
    module.exports = require('nano')(url);
    callback();
};