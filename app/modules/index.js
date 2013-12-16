var db = require('./database');

// Collections
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
 * Parses information from a game to build the search indexes
 * @param id
 * @param game
 */
exports.parseGame = function(id,game){
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