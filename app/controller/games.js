var db = require('../modules/database');
var steam_fetch = require('../modules/steam');
var Cache = require('../modules/cache');
var Index = require('../modules/index');

// Collections
var Games = db.collection('games');

/**
 * Add game to the cache
 * @param id
 * @param game
 */
var addToCache = function(id,game){
    game.name = escape(game.name);
    game.detailed_description = escape(game.detailed_description);
    if(game.legal_notice){
        game.legal_notice = escape(game.legal_notice);
    }
    Cache.put('app-'+id,game,7200);
};

/**
 * Return in the same format that steam returns {<app_id>: { data: <game> }}
 * @param id
 * @param data
 * @returns {{}}
 * @param escaped
 */
function responseFormat(id,data,escaped){
    var response = {};
    if(escaped){
        data.name = unescape(data.name);
        data.detailed_description = unescape(data.detailed_description);
        if(data.legal_notice){
            data.legal_notice = unescape(data.legal_notice);
        }
    }
    response[id] = {data: data};
    return response;
}

/**
 * Fetch the game from Steam
 * @param id number
 * @param callback function
 * @param [_id] Mongo _id attribute if updating
 */
function fetchParseGame(id,callback,_id){
    steam_fetch('appdetails?appids=' + id,function(data){
        var game = JSON.parse(data);
        if(game && game[id].data){
            game = game[id].data;
            game.steam_appid = parseInt(game.steam_appid,10);
            Index.parseGame(id,game,_id);
            addToCache(id,game);
        }
        callback(data);
    });
}

/**
 * Fetches a given game from the ID, first tries to fetch from local DB, otherwise fetches from Steam API and adds to DB and cache
 * @param id
 * @param callback
 */
var getGameById = function(id,callback){
    Games.findOne({
        steam_appid: id
    },function(err, data){
        if(err || data == null){
            fetchParseGame(id,callback);
        } else {
            addToCache(id,data);
            callback(responseFormat(id,data,false));
        }
    });
};

/**
 * Fetches a given game by ID from the cache, delegates to getGameById if it doesn't exist in cache
 * @param id
 * @param callback
 */
exports.getGameById = function(id,callback){
    Cache.get('app-'+id, function (error, data) {
        if(!data || error){
            getGameById(id,callback);
        } else {
            callback(responseFormat(id,data,true));
        }
    });
};

// Export it for Grunt use
exports.fetchParseGame = fetchParseGame;

// If cache is not initialized, skip caching and eliminate a function call
if(typeof Cache === 'function'){
    addToCache = function(){ return true; };

    exports.getGameById = getGameById;
}