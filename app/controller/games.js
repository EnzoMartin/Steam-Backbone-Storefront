var db = require('../modules/database');
var steam_fetch = require('../modules/steam');
var Cache = require('../modules/cache');
var Q = require('q');

// Collections
var Games = db.collection('games');
var Achievements = db.collection('achievements_index');
var CategoriesIndex = db.collection('categories_index');
var DevelopersIndex = db.collection('developers_index');
var GenresIndex = db.collection('genres_index');
var DemosIndex = db.collection('demos_index');
var LanguagesIndex = db.collection('languages_index');
var MetacriticIndex = db.collection('metacritic_index');
var PlatformsIndex = db.collection('platforms_index');
var PublishersIndex = db.collection('publishers_index');
var RecommendationsIndex = db.collection('recommendations_index');

/**
 * Make a query promise and return the promise
 * @param collection
 * @param query
 * @returns {promise|*|Function|promise|promise|promise}
 */
function makeQueryPromise(collection,query){
    var d = Q.defer();
    collection.find(query, function(err, data){
        d.resolve(err || data);
    });
    return d.promise;
}

/**
 * Add game to the cache
 * @param id
 * @param game
 */
function addToCache(id,game){
    game.name = escape(game.name);
    game.detailed_description = escape(game.detailed_description);
    if(game.legal_notice){
        game.legal_notice = escape(game.legal_notice);
    }
    Cache.put('app-'+id,game,7200);
}

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
 * Fetches a given game from the ID, first tries to fetch from local DB, otherwise fetches from Steam API and adds to DB
 * @param id
 * @param callback
 */
exports.getGameById = function(id,callback){
    Cache.get('app-'+id, function (error, data) {
        if(!data || error){
            Games.findOne({
                steam_appid: id
            },function(err, data){
                if(err || data == null){
                    steam_fetch('appdetails?appids=' + id,function(data){
                        var game = JSON.parse(data);
                        if(game && game[id].data){
                            game = game[id].data;
                            game.steam_appid = parseInt(game.steam_appid,10);
                            indexGame(id,game);
                            Games.save(game);
                            addToCache(id,game);
                        }
                        callback(data);
                    });
                } else {
                    addToCache(id,data);
                    callback(responseFormat(id,data,false));
                }
            });
        } else {
            callback(responseFormat(id,data,true));
        }
    });
};

/**
 * Get a game by query
 * @param params {{}}
 * @param callback function
 */
exports.getGame = function(params,callback){
    //console.log('params',params);
    var limit = 25;
    var query = {};
    var queue = [];

    if(params.name){
        query.name = '/.*' + params.name.replace(/\W/g, '') + '*/';
    }

    // Find games by genre
    if(params.genres){
        queue.push(makeQueryPromise(GenresIndex,{
            id: {
                $in: params.genres.split(',').map(function(x){
                    return parseInt(x, 10)
                })
            }
        }));
    }

    // Find games by category
    if(params.categories){
        queue.push(makeQueryPromise(CategoriesIndex,{
            id: {
                $in: params.categories.split(',').map(function(x){
                    return parseInt(x, 10)
                })
            }
        }));
    }


    //console.log('queue',queue);
    Q.allSettled(queue).spread(function(test){
        var lists = [];
        var i = 0;
        var len = arguments.length;
        while(i < len){
            var argument = arguments[i];
            argument.value.forEach(function(result){
                lists.push(result.games);
            });
            i++;
        }
        var total = lists.length;
        var combined = [];
        combined = combined.concat.apply(combined, lists);

        var occurrences = {};
        var j = 0;
        var len_j = combined.length;
        while(j < len_j){
            var id = combined[j];
            if (occurrences[id]) {
                occurrences[id]++;
            } else {
                occurrences[id] = 1;
            }
            j++;
        }

        var final = [];
        for(var item in occurrences){
            if(occurrences[item] === total){
                final.push(parseInt(item,10));
            }
        }

        Games.find({
            name: new RegExp(query.name),
            steam_appid: {$in: final}
        },function(err, data){
            callback(err || data);
        }).limit(limit || 25);
    }).done();


    // Set new limit if it's a number
    if(params.limit){
        params.limit = parseInt(params.limit,10);
        limit = (!isNaN(params.limit))? Math.abs(params.limit) : limit;
    }
};

/**
 * Parses information from a game to build the search indexes
 * @param id
 * @param game
 */
var indexGame = function(id,game){
    var i;
    var len;

    // Save the total achievement count for the game
    if(typeof game.achievements === 'object'){
        Achievements.save({id: id, total: game.achievements.total});
    }

    // Save if it has a demo
    if(typeof game.demos === 'object'){
        DemosIndex.save({hasDemo: id, demos: game.demos});
    }

    // Save the game categories
    if(typeof game.categories === 'object'){
        i = 0;
        len = game.categories.length;

        while(i < len){
            var category = game.categories[i];
            category.id = parseInt(category.id,10);
            updateCategoryType(category,id);
            i++;
        }
    }

    // Save the game developers
    if(typeof game.developers === 'object'){
        i = 0;
        len = game.developers.length;

        while(i < len){
            updateDevelopers(game.developers[i],id);
            i++;
        }
    }

    // Save the genres
    if(typeof game.genres === 'object'){
        i = 0;
        len = game.genres.length;

        while(i < len){
            var genre = game.genres[i];
            genre.id = parseInt(genre.id,10);
            updateGenreType(genre,id);
            i++;
        }
    }

    // Save the metacritic score
    if(typeof game.metacritic === 'object'){
        MetacriticIndex.save({id: id, score: game.metacritic.score});
    }

    // Save the platforms
    if(typeof game.platforms === 'object'){
        updatePlatforms(game.platforms,id);
    }

    // Save the publishers
    if(typeof game.publishers === 'object'){
        i = 0;
        len = game.publishers.length;

        while(i < len){
            updatePublishers(game.publishers[i],id);
            i++;
        }
    }

    // Save the recommendations
    if(typeof game.recommendations === 'object'){
        RecommendationsIndex.save({id: id, total: game.recommendations.total});
    }

    // Save the languages
    if(typeof game.supported_languages === 'object'){
        game.supported_languages.split(',').forEach(function(lang){
            updateLanguages(lang.split('<')[0],id);
        });
    }
};

/**
 * If category not found, creates category and category index, otherwise adds the game to that category's list array
 * @param category
 * @param id
 */
var updateCategoryType = function(category,id){
    CategoriesIndex.findOne({id:category.id},function(err,res){
        if(err || res == null){
            // Create the category type
            category.games = [id];
            category.total = 1;
            CategoriesIndex.save(category);
        } else {
            // Append new game to the category index
            CategoriesIndex.findAndModify({
                query: {id: category.id},
                update: {
                    $addToSet: {games: id},
                    $inc: {total: 1}
                }
            });
        }
    });
};

/**
 * Creates/updates the developers with a game id array
 * @param developer
 * @param id
 */
var updateDevelopers = function(developer,id){
    DevelopersIndex.findAndModify({
        query: {name: developer},
        update: {$addToSet: {games: id}},
        upset: true
    });
};

/**
 * If genre not found, creates genre and genre index, otherwise adds the game to that genre's list array
 * @param genre
 * @param id
 */
var updateGenreType = function(genre,id){
    GenresIndex.findOne({id:genre.id},function(err,res){
        if(err || res == null){
            // Create the genre type
            genre.games = [id];
            genre.total = 1;
            GenresIndex.save(genre);
        } else {
            // Append new game to the genre index
            GenresIndex.findAndModify({
                query: {id: genre.id},
                update: {
                    $addToSet: {games: id},
                    $inc: {total: 1}
                }
            });
        }
    });
};

/**
 * Creates/updates the platforms with a game id array, or removes the game from a platform
 * @param platforms
 * @param id
 */
var updatePlatforms = function(platforms,id){
    for(var platform in platforms){
        var available = platforms[platform];
        var action = available ? {$addToSet: {games: id}} : {$pull: {games: id}};

        PlatformsIndex.findAndModify({
            query: {name: platform},
            update: action,
            upset: true
        });
    }
};

/**
 * Creates/updates the publishers with a game id array
 * @param publisher
 * @param id
 */
var updatePublishers = function(publisher,id){
    PublishersIndex.findAndModify({
        query: {name: publisher},
        update: {$addToSet: {games: id}},
        upset: true
    });
};

/**
 * If language not found, creates language and language index, otherwise adds the game to that language's list array
 * @param language
 * @param id
 */
var updateLanguages = function(language,id){
    LanguagesIndex.findAndModify({
        query: {name: language},
        update: {$addToSet: {games: id}},
        upset: true
    });
};