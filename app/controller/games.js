var db = require('../modules/database');
var Games = db.collection('games');
var steam_fetch = require('../modules/steam');

exports.getGame = function(id,callback){
    Games.findOne({
        steam_appid: id
    },function(err, data){
        if(err || data == null){
            steam_fetch('appdetails?appids=' + id,function(data){
                var game = JSON.parse(data);
                if(game){
                    game = game[id].data;
                    game.steam_appid = parseInt(game.steam_appid,10);
                    Games.save(game);
                }
                callback(data);
            });
        } else {
            // Return in the same format that steam returns {<app_id>: { data: <game> }}
            var response = {};
            response[id] = {data: data};
            callback(response);
        }
    });
};