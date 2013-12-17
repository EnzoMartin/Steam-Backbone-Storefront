var db = require('../modules/database');
var Cache = require('../modules/cache');
var Q = require('q');

// Collections
var Games = db.collection('games');
var AchievementsIndex = db.collection('achievements_index');
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
 * Ensures alphanumeric only and builds match-any regex
 * @param value
 * @returns {string}
 */
function matchAny(value){
    return '.*' + value.replace(/\W/g, '') + '.*';
}

/**
 * Check if variable is a boolean
 * @param input
 * @returns {boolean}
 */
function isTrue(input) {
    return typeof input == 'string' ? input.toLowerCase() == 'true' : !!input;
}

/**
 * Used for sorting by name
 * @param a
 * @param b
 * @returns {number}
 */
function compareNames(a,b) {
    if (a.name < b.name){
        return -1;
    }
    if (a.name > b.name){
        return 1;
    }
    return 0;
}

/**
 * Converts a param to a use-able array
 * @param param
 * @param [ints]
 * @returns {*}
 */
function parseParam(param,ints){
    var parsed;
    if(typeof param === 'object'){
        parsed = param;
    } else if(typeof param === 'string') {
        parsed = param.split(',');
        if(ints){
            parsed = parsed.map(function(x){
                return parseInt(x, 10)
            });
        }
    }
    return parsed;
}

/**
 * Gets all the available sorting fields, saves/gets from Cache if available
 * @param callback
 */
exports.getFields = function(callback){
    Cache.get('filters',function(err,data){
        if(err || !data){
            var queue = [];

            queue.push(makeQueryPromise(CategoriesIndex,{}));
            queue.push(makeQueryPromise(GenresIndex,{}));
            queue.push(makeQueryPromise(LanguagesIndex,{}));
            queue.push(makeQueryPromise(DevelopersIndex,{}));
            queue.push(makeQueryPromise(PublishersIndex,{}));
            queue.push(makeQueryPromise(PlatformsIndex,{}));

            Q.allSettled(queue).spread(function(categories,genres,languages,developers,publishers,platforms){
                var keys = ['categories','genres','languages','developers','publishers','platforms'];
                var filters = {};
                var k = 0;
                var len = keys.length;

                while(k < len){
                    var key = keys[k];
                    filters[key] = [];
                    arguments[k].value.forEach(function(item){
                        if(item.name){
                            var meta = {name:item.name,total:item.games.length};
                            if(item.id){
                                meta.id = item.id;
                            }
                            filters[key].push(meta);
                        }
                    });
                    // Sort by item names
                    filters[key].sort(compareNames);
                    k++;
                }
                Cache.put('filters',filters);
                callback(filters);
            }).done();
        } else {
            callback(data);
        }
    });
};

/**
 * Get a game by query
 * @param params {{}}
 * @param callback function
 */
exports.getGame = function(params,callback){
    var limit = 25;
    var query = {};
    var queue = [];

    // Find by game title
    if(params.name){
        query.name = new RegExp(matchAny(params.name), 'gi');
    }

    // Find games by genre
    if(params.genres){
        queue.push(makeQueryPromise(GenresIndex,{
            id: {
                $in: parseParam(params.genres,true)
            }
        }));
    }

    // Find games by category
    if(params.categories){
        queue.push(makeQueryPromise(CategoriesIndex,{
            id: {
                $in: parseParam(params.categories,true)
            }
        }));
    }

    // Find games by achievement count
    if(typeof params.achievements !== 'undefined'){
        var count = parseInt(params.achievements,10);
        if(!isNaN(count)){
            //TODO: support GTE/GT/LT/LTE/EQ
            queue.push(makeQueryPromise(AchievementsIndex,{
                total: {$gte: count}
            }));
        }
    }

    // Find by publisher
    if(params.publishers){
        queue.push(makeQueryPromise(PublishersIndex,{
            name: {$in: parseParam(params.publishers)}
        }));
    }

    // Find by developer
    if(params.developers){
        queue.push(makeQueryPromise(DevelopersIndex,{
            name: {$in: parseParam(params.developers)}
        }));
    }

    // Find by if it has a demo
    if(typeof params.demo !== 'undefined'){
        var boolean = isTrue(params.demo);
        if(boolean){
            queue.push(makeQueryPromise(DemosIndex,{
                hasDemo: true
            }));
        }
    }

    // Find by Metacritic score
    if(typeof params.metacritic !== 'undefined'){
        var score = parseInt(params.metacritic,10);
        if(!isNaN(score)){
            //TODO: support GTE/GT/LT/LTE/EQ
            queue.push(makeQueryPromise(MetacriticIndex,{
                score: {$gte: score}
            }));
        }
    }

    // Find by number of Recommendations
    if(typeof params.recommendations !== 'undefined'){
        var recommendations = parseInt(params.recommendations,10);
        if(!isNaN(recommendations)){
            //TODO: support GTE/GT/LT/LTE/EQ
            queue.push(makeQueryPromise(RecommendationsIndex,{
                total: {$gte: recommendations}
            }));
        }
    }

    // Find by supported platform
    if(params.platforms){
        queue.push(makeQueryPromise(PlatformsIndex,{
            name: {$in: parseParam(params.platforms)}
        }));
    }

    // Find by supported languages
    if(params.languages){
        queue.push(makeQueryPromise(LanguagesIndex,{
            name: {$in: parseParam(params.languages)}
        }));
    }

    // Set new limit if it's a number
    if(params.limit){
        params.limit = parseInt(params.limit,10);
        limit = (!isNaN(params.limit))? Math.abs(params.limit) : limit;
    }

    Q.allSettled(queue).spread(function(){
        var lists = [];
        var q = 0;
        // Get total queries
        var total = arguments.length;
        // Extract all returned values
        while(q < total){
            var argument = arguments[q];
            argument.value.forEach(function(result){
                lists.push(result.games);
            });
            q++;
        }

        var combined = [];
        // Concatenate all the results into 1 array
        combined = combined.concat.apply(combined, lists);

        var occurrences = {};
        var i = 0;
        var len = combined.length;
        // Count the occurrences of each ID
        while(i < len){
            var id = combined[i];
            if (occurrences[id]) {
                occurrences[id]++;
            } else {
                occurrences[id] = 1;
            }
            i++;
        }

        // Compared occurrences with the total to see which ones match what we're searching for
        var final = [];
        for(var item in occurrences){
            if(occurrences[item] === total){
                final.push(parseInt(item,10));
            }
        }

        if(final.length){
            query.steam_appid = {$in: final};
        }

        // Fetch the game ID we end up with and return the results
        Games.find(query,
        {},
        {limit: limit || 25},
        function(err, data){
            callback(err || data);
        });
    }).done();
};