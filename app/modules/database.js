var mongo = require('mongojs');

module.exports = function(config){
    module.exports = mongo(config.db);
};