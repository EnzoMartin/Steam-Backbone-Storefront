var db = require('../modules/database');
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
        query.name = '.*' + params.name.replace(/\W/g, '') + '.*';
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
            name: new RegExp(query.name, 'i'),
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