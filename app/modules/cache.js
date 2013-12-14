var azurecache = require('azurecache');

exports.connect = function(){
    module.exports = azurecache.create({
        identifier: process.env.CACHE_ENDPOINT,
        token: process.env.CACHE_KEY,
        ttl: process.env.CACHE_TTL
    });
};