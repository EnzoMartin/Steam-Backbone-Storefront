var mongo = require('mongojs');

exports.connect = function(config){
    module.exports = mongo(config.db);
};