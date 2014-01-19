var nano = require('../modules/database');
var steam_fetch = require('../modules/steam-url');
var Cache = require('../modules/cache');
var Index = require('../modules/index');

// Collections
var Games = nano.db.use('steam');

// Game processing queue
var GameQueue = [];
exports.GameQueue = GameQueue;

/**
 * Add game to the cache
 * @param id
 * @param game
 * @param cache {boolean} Cache even if not already cached
 */
var addToCache = function(id,game,cache){
    Cache.get('app-'+id, function(error, data){
        if (data || cache) {
            game.escaped_name = escape(game.name);
            game.escaped_detailed_description = escape(game.detailed_description);
            if (game.legal_notice) {
                game.escaped_legal_notice = escape(game.legal_notice);
            }
            Cache.put('app-' + id, game, 7200);
        }
    });
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
        data.name = unescape(data.escaped_name);
        data.detailed_description = unescape(data.escaped_detailed_description);
        if(data.legal_notice){
            data.legal_notice = unescape(data.escaped_legal_notice);
        }
    }
    response[id] = {data: data};
    return response;
}

/**
 * Fetch the game from Steam
 * @param id number
 * @param callback function
 * @param data {{}} data received from listener
 */
function fetchParseGame(id,callback,data){
    steam_fetch('appdetails?appids=' + id,function(response){
        var game = JSON.parse(response);

        if(game){
            if(typeof game[id].data === 'undefined'){
                game[id].data = {
                    name: 'Unknown'
                }
            }

            game = game[id].data;
            game.steam_appid = parseInt(game.steam_appid,10);
            Index.parseGame(id,game,data);
            addToCache(id,game,typeof callback === 'function');
        }
        if(typeof callback === 'function'){
            callback(data);
        }
    });
}

/**
 * Fetches a given game from the ID, first tries to fetch from local DB, otherwise fetches from Steam API and adds to DB and cache
 * @param id
 * @param callback
 */
var getGameById = function(id,callback){
    Games.get(id,function(err, data){
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

/**
 * Loops over multiple games and delegates to fetchParseGame
 * @param games {{}}
 */
exports.fetchParseGames = function(games){
    for(var id in games){
        var game = games[id];
        this.fetchParseGame(game.AppID);
    }
};

/**
 * Process the queue of games and reset it
 */
exports.processQueue = function(){
    // Clone array and empty the queue
    var games = JSON.parse(JSON.stringify(GameQueue));
    GameQueue = [];

    var i = 0;
    var len = games.length;
    while(i < len){
        var game = games[i];
        if(typeof game.AppID !== 'undefined'){
            this.fetchParseGame(game.AppID,null,game.data || {name: 'Unknown'});
        }
        i++;
    }
};

// If cache is not initialized, skip caching and eliminate a function call
if(typeof Cache === 'function'){
    addToCache = function(){ return true; };

    exports.getGameById = getGameById;
}