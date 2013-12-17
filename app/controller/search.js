var db = require('../modules/database');
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
 * Get a game by query
 * @param params {{}}
 * @param callback function
 */
exports.getGame = function(params,callback){
    console.log('params',params);
    var limit = 25;
    var query = {};
    var queue = [];

    // Find by game title
    if(params.name){
        query.name = matchAny(params.name);
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

    // Find games by achievement count
    if(typeof params.achievements !== 'undefined'){
        var count = parseInt(params.achievements,10);
        if(!isNaN(count)){
            //TODO: support GTE/GT/LT/LTE/EQ
            queue.push(makeQueryPromise(AchievementsIndex,{
                $gte: {total: count}
            }));
        }
    }

    // Find by publisher
    if(params.publishers){
        queue.push(makeQueryPromise(PublishersIndex,{
            name: {$in: params.publishers.split(',')}
        }));
    }

    // Find by developer
    if(params.developers){
        queue.push(makeQueryPromise(DevelopersIndex,{
            name: {$in: params.developers.split(',')}
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

    // Set new limit if it's a number
    if(params.limit){
        params.limit = parseInt(params.limit,10);
        limit = (!isNaN(params.limit))? Math.abs(params.limit) : limit;
    }

    console.log('queue',queue);
    Q.allSettled(queue).spread(function(){
        var lists = [];
        var i = 0;
        var len = arguments.length;
        // Extract all returned values
        while(i < len){
            var argument = arguments[i];
            argument.value.forEach(function(result){
                lists.push(result.games);
            });
            i++;
        }

        // Get total queries
        var total = arguments.length;
        var combined = [];
        // Concatenate all the results into 1 array
        combined = combined.concat.apply(combined, lists);

        var occurrences = {};
        var j = 0;
        var len_j = combined.length;
        // Count the occurrences of each ID
        while(j < len_j){
            var id = combined[j];
            if (occurrences[id]) {
                occurrences[id]++;
            } else {
                occurrences[id] = 1;
            }
            j++;
        }

        // Compared occurrences with the total to see which ones match what we're searching for
        var final = [];
        for(var item in occurrences){
            if(occurrences[item] === total){
                final.push(parseInt(item,10));
            }
        }

        // Fetch the game ID we end up with and return the results
        Games.find({
            name: new RegExp(query.name, 'i'),
            steam_appid: {$in: final}
        },function(err, data){
            callback(err || data);
        }).limit(limit || 25);
    }).done();
};