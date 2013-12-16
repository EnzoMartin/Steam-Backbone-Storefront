var azurecache = require('azurecache');

module.exports = function(fake){
    if(fake){
        exports.get = function(data,callback){ if(typeof callback === 'function'){callback(null,null);} else { return null }};
        exports.put = function(data,callback){ if(typeof callback === 'function'){callback(null,null);} else { return null }};
        exports.remove = function(data,callback){ if(typeof callback === 'function'){callback(null,null);} else { return null }};
        module.exports = exports;
    } else {
        module.exports = azurecache.create({
            identifier: process.env.CACHE_ENDPOINT,
            token: process.env.CACHE_KEY,
            ttl: process.env.CACHE_TTL
        });
    }
};