var nano = require('./database');
var Cache = require('./cache');

// Grab Steam DB
var Games = nano.db.use('steam');

// Update the indexes
var indexes = {
    /**
     * Total achievement count index
     * @param doc {{}}
     */
    achievements: {
        views: {
            achievements: {
                map: function(doc){
                    emit(doc._id,typeof doc.achievements !== 'undefined' ? doc.achievements.total : 0);
                }
            }
        },
        indexes: {
            achievements: {
                analyzer: 'standard',
                index: function(doc){
                    index('achievements',typeof doc.achievements !== 'undefined' ? doc.achievements.total : 0);
                }
            }
        }
    },

    /**
     * Game has demo or not
     * @param doc {{}}
     */
    demo: {
        views: {
            hasDemo: {
                map: function(doc){
                    if(typeof doc.demo === 'object'){
                        emit(doc._id,true);
                    }
                }
            },
            noDemo: {
                map: function(doc){
                    if(typeof doc.demo !== 'object'){
                        emit(doc._id,false);
                    }
                }
            }
        },
        indexes: {
            demo: {
                analyzer: 'standard',
                index: function(doc){
                    index('demo',typeof doc.demos === 'object');
                }
            }
        }
    },

    /**
     * Categories types index by id
     * @param doc {{}}
     */
    categoryId: {
        views: {
            categoryId: {
                map: function(doc){
                    if(typeof doc.categories !== 'undefined'){
                        var i = 0;
                        var len = doc.categories.length;

                        while(i < len){
                            var category = doc.categories[i];
                            emit(doc._id,parseInt(category.id,10));
                            i++;
                        }
                    }
                }
            }
        },
        indexes: {
            categoryId: {
                analyzer: 'standard',
                index: function(doc){
                    if(typeof doc.categories !== 'undefined'){
                        var i = 0;
                        var len = doc.categories.length;

                        while(i < len){
                            var category = doc.categories[i];
                            index('categoryId',parseInt(category.id,10));
                            i++;
                        }
                    }
                }
            }
        }
    },

    /**
     * Categories types index by name
     * @param doc {{}}
     */
    categoryName: {
        views: {
            categoryName: {
                map: function(doc){
                    if(typeof doc.categories !== 'undefined'){
                        var i = 0;
                        var len = doc.categories.length;

                        while(i < len){
                            var category = doc.categories[i];
                            emit(doc._id,category.description);
                            i++;
                        }
                    }
                }
            }
        },
        indexes: {
            categoryName: {
                analyzer: 'standard',
                index: function(doc){
                    if(typeof doc.categories !== 'undefined'){
                        var i = 0;
                        var len = doc.categories.length;

                        while(i < len){
                            var category = doc.categories[i];
                            index('categoryName',category.description);
                            i++;
                        }
                    }
                }
            }
        }
    },

    /**
     * Developers index
     * @param doc {{}}
     */
    developers: {
        views: {
            developers: {
                map: function(doc){
                    if(typeof doc.developers !== 'undefined'){
                        var i = 0;
                        var len = doc.developers.length;

                        while(i < len){
                            emit(doc._id,doc.developers[i]);
                            i++;
                        }
                    }
                }
            }
        },
        indexes: {
            developers: {
                analyzer: 'standard',
                index: function(doc){
                    if(typeof doc.developers !== 'undefined'){
                        var i = 0;
                        var len = doc.developers.length;

                        while(i < len){
                            index('developer',doc.developers[i]);
                            i++;
                        }
                    }
                }
            }
        }
    },

    /**
     * Genres types index by id
     * @param doc {{}}
     */
    genreId: {
        views: {
            genreId: {
                map: function(doc){
                    if(typeof doc.genres !== 'undefined'){
                        var i = 0;
                        var len = doc.genres.length;
                        while(i < len){
                            var genre = doc.genres[i];
                            emit(doc._id, parseInt(genre.id,10));
                            i++;
                        }
                    }
                }
            }
        },
        indexes: {
            genreId: {
                analyzer: 'standard',
                index: function(doc){
                    if(typeof doc.genres !== 'undefined'){
                        var i = 0;
                        var len = doc.genres.length;
                        while(i < len){
                            var genre = doc.genres[i];
                            index('genreId', parseInt(genre.id,10));
                            i++;
                        }
                    }
                }
            }
        }
    },

    /**
     * Genres types index by name
     * @param doc {{}}
     */
    genreName: {
        views: {
            genreName: {
                map: function(doc){
                    if(typeof doc.genres !== 'undefined'){
                        var i = 0;
                        var len = doc.genres.length;
                        while(i < len){
                            var genre = doc.genres[i];
                            emit(doc._id, genre.description);
                            i++;
                        }
                    }
                }
            }
        },
        indexes: {
            genreName: {
                analyzer: 'standard',
                index: function(doc){
                    if(typeof doc.genres !== 'undefined'){
                        var i = 0;
                        var len = doc.genres.length;
                        while(i < len){
                            var genre = doc.genres[i];
                            index('genreName', genre.description);
                            i++;
                        }
                    }
                }
            }
        }
    },

    /**
     * Metacritic index
     * @param doc {{}}
     */
    metacritic: {
        views: {
            metacritic: {
                map: function(doc){
                    if(typeof doc.metacritic !== 'undefined'){
                        emit(doc._id,game.metacritic.score);
                    }
                }
            }
        },
        indexes: {
            metacritic: {
                analyzer: 'standard',
                index: function(doc){
                    if(typeof doc.metacritic !== 'undefined'){
                        index('metacritic',game.metacritic.score);
                    }
                }
            }
        }
    },

    /**
     * Platform index
     * @param doc {{}}
     */
    platform: {
        views: {
            platform: {
                map: function(doc){
                    if(typeof doc.platforms === 'object'){
                        for(var platform in doc.platforms){
                            index(doc._id,doc.platforms[platform]);
                        }
                    }
                }
            }
        },
        indexes: {
            platform: {
                analyzer: 'standard',
                index: function(doc){
                    if(typeof doc.platforms === 'object'){
                        for(var platform in doc.platforms){
                            index('platform',doc.platforms[platform]);
                        }
                    }
                }
            }
        }
    },

    /**
     * Publishers index
     * @param doc {{}}
     */
    publishers: {
        views: {
            publishers: {
                map: function(doc){
                    if(typeof doc.publishers === 'object'){
                        var i = 0;
                        var len = doc.publishers.length;

                        while(i < len){
                            emit(doc._id,doc.publishers[i]);
                            i++;
                        }
                    }
                }
            }
        },
        indexes: {
            publishers: {
                analyzer: 'standard',
                index: function(doc){
                    if(typeof doc.publishers === 'object'){
                        var i = 0;
                        var len = doc.publishers.length;

                        while(i < len){
                            index('publisher',doc.publishers[i]);
                            i++;
                        }
                    }
                }
            }
        }
    },

    /**
     * Recommendations count index
     * @param doc {{}}
     */
    recommendations: {
        views: {
            recommendations: {
                map: function(doc){
                    if(typeof doc.recommendations === 'object'){
                        index(doc._id,parseInt(doc.recommendations.total,10));
                    }
                }
            }
        },
        indexes: {
            recommendations: {
                analyzer: 'standard',
                index: function(doc){
                    if(typeof doc.recommendations === 'object'){
                        index('recommendations',parseInt(doc.recommendations.total,10));
                    }
                }
            }
        }
    },

    /**
     * Languages index
     * @param doc {{}}
     */
    languages: {
        views: {
            languages: {
                map: function(doc){
                    if(typeof doc.supported_languages === 'string'){
                        doc.supported_languages.split(',').forEach(function(lang){
                            emit(doc._id,lang.split('<')[0].trim());
                        });
                    }
                }
            }
        },
        indexes: {
            languages: {
                analyzer: 'standard',
                index: function(doc){
                    if(typeof doc.supported_languages === 'string'){
                        doc.supported_languages.split(',').forEach(function(lang){
                            index('language',lang.split('<')[0].trim());
                        });
                    }
                }
            }
        }
    }
};

// Find existing design docs
Games.list({startkey:'_design',endkey:'_e'},function(err,data){
    updateDesignDocs(data);
});

function updateDesignDocs(revisions){
    var rows = {};
    if(revisions && revisions.rows && revisions.rows.length){
        var i = 0;
        var len = revisions.rows.length;
        while(i < len){
            var row = revisions.rows[i];
            rows[row.id] = row.value.rev;
            i++;
        }
    }

    // Build the design documents for bulk insert/update
    var docs = [];
    for(var name in indexes){
        var indexObj = indexes[name];
        indexObj._id = '_design/' + name;
        indexObj.language = 'javascript';

        // Check if document exists so we can specify the revision
        if(rows[indexObj._id]){
            indexObj._rev = rows[indexObj._id];
            delete rows[indexObj._id];
        }

        docs.push(indexObj);
    }

    // Delete any remaining docs
    if(Object.keys(rows).length){
        for(var id in rows){
            docs.push({
                _id: id,
                _rev: rows[id],
                _deleted: true
            });
        }
    }

    // Bulk insert/update/delete the docs
    Games.bulk({docs:docs}, function(err){
        if(err){
            console.log('Failed updating design docs',err);
        } else {
            console.log('Design docs updated');
        }
    });
}

/**
 * Parses information from a game to build the search indexes
 * @param id number
 * @param game {{}}
 */
exports.parseGame = function(id,game){
    // Fetch head only to see if game already exists
    Games.head('app-'+id,function(err, _, headers){
        // Append current revision if document found
        if(typeof headers !== 'undefined'){
            game._rev = headers.etag.replace(/"/g,'');
        }

        // Insert/update game
        Games.insert(game,'app-'+id,function(err, body){
            if(err){
                console.log('Error inserting item',err);
            } else {
                console.log('Game inserted', id, body.id);
            }

            // Invalidate filter cache
            Cache.remove('filters');
        });
    });
};