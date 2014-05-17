var nano = require('../modules/nosql');
var steam_fetch = require('../modules/steam-url');
var Index = require('../modules/index');

// Collections
var Games = nano.db.use('steam');

// Game processing queue
var GameQueue = [];
exports.GameQueue = GameQueue;


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

        if(game && typeof game[id].data !== 'undefined'){
            game = game[id].data;
            game.steam_appid = parseInt(game.steam_appid,10);
            Index.parseGame(id,game,data);
        }
        if(typeof callback === 'function'){
            callback(null,data);
        }
    });
}

/**
 * Fetches a given game from the ID, first tries to fetch from local DB, otherwise fetches from Steam API and adds to DB
 * @param id
 * @param callback
 */
exports.getGameById = function(id,callback){
    Games.get('app-'+id,function(err, data){
        if(err || data == null){
            fetchParseGame(id,callback);
        } else {
            callback(err,responseFormat(id,data,false));
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
        if(typeof game.AppID !== 'undefined' && typeof game.data !== 'undefined'){
            this.fetchParseGame(game.AppID,null,game.data);
        }
        i++;
    }
};