var fs = require('fs');
var i18n = require('i18next');
var http = require('http');
var Q = require('q');
var games = require('../app/controller/games');
var search = require('../app/controller/search');
var steam_fetch = require('../app/modules/steam');
var Cache = require('../app/modules/cache');
var pjson = require('../package.json');

// Load all the JS files for backbone
var files = {};
files.views = fs.readdirSync('public/js/views');
files.models = fs.readdirSync('public/js/models');
files.collections = fs.readdirSync('public/js/collections');
var processed = {};
var version = Math.floor(100000000 + Math.random() * 900000000);

for (var i in files) {
    var j = 0;
    processed[i] = '';
    while(j < files[i].length){
        var file = files[i][j];
        if(file.indexOf('.js') != -1){
            processed[i] += '\'/js/' + i + '/' + file + '?' + version + '\',\n';
        }
        j++;
    }
}

/**
 * Get base file definitions and global app data
 * @returns {{lang: string, version: (string|version|*), models: (*|models|models), collections: (*|Function), views: *}}
 */
function index(){
    // TODO: Pass frontend translations
    // Render index page and pass through all the variables
    return {
        lang: 'en',
        bootstrapped: '{}',
        version: pjson.version,
        models:processed.models,
        collections:processed.collections,
        views:processed.views
    };
}

/**
 *
 * @param method
 * @param [params]
 * @returns {promise}
 */
function makePromise(method,params){
    var d = Q.defer();
    var args = [];
    if(params){
        args.push(params);
    }
    args.push(function(err, data){
        d.resolve(err || data);
    });
    method.apply(method,args);
    return d.promise;
}

module.exports = function(app,config){
    // Search page, return with available search filters
    app.get('/search',function(req,res){
        var json = req.is('json');
        var queue = [];

        // Get the filter fields if not JSON request
        if(!json){
            queue.push(makePromise(search.getFields));
        }

        // Perform search if query found
        if(Object.keys(req.query).length){
            queue.push(makePromise(search.getGame,req.query));
        }

        Q.allSettled(queue).spread(function(){
            if(json){
                res.send({results:arguments[0].value});
            } else {
                var files = index();
                var data = {filters: arguments[0].value};
                if(arguments[1]){
                    data.results = arguments[1].value;
                }
                files.bootstrapped = JSON.stringify(data);
                res.render('index',files);
            }
        });
    });

	// Home Route
    app.get('/:locale?',function(req,res){
        // Handle switching language
        if(req.params.locale){
            var locale = (req.params.locale || 'en-US').split('-');
            if(locale.length != 2){
                locale = ['en','US'];
            }
            req.i18n.setLng(locale[0] + '-' + locale[1].toUpperCase());
        }

        res.render('index',index());
    });

    /**
     * Fetch homepage apps
     */
    app.get('/api/featured',function(req,res){
        Cache.get('featured',function(err,data){
            if(!data || err){
                steam_fetch('featured',function(data){
                    Cache.put('featured',data);
                    res.send(data);
                });
            } else {
                res.send(data);
            }
        });
    });

    /**
     * Fetch featured category apps
     */
    app.get('/api/featuredcategories',function(req,res){
        Cache.get('featuredcategories',function(err,data){
            if(!data || err){
                steam_fetch('featuredcategories',function(data){
                    Cache.put('featuredcategories',data);
                    res.send(data);
                });
            } else {
                res.send(data);
            }
        });
    });

    /**
     * Fetch package details based off ID(s)
     * @param packageids {string}
     */
    app.get('/api/packagedetails',function(req,res){
        steam_fetch('packagedetails?packageids=' + req.query.packageids,function(data){
            res.send(data);
        });
    });

    /**
     * Fetch specific app based off ID(s)
     * @param appids {string}
     */
    app.get('/api/games',function(req,res){
        //TODO: Add support for fetching multiple
        var gameId = parseInt(req.query.appids,10);

        games.getGameById(gameId,function(data){
            res.send(data);
        });
    });

    /**
     * Fetch sale page
     * @param id {string}
     */
    app.get('/api/salepage',function(req,res){
        steam_fetch('salepage?id=' + req.query.id,function(data){
            res.send(data);
        });
    });

    /**
     * Fetch app details by ID(s) based off the current authenticated user
     * @param appids {string}
     */
    app.get('/api/appuserdetails',function(req,res){
        steam_fetch('appuserdetails?appids=' + req.query.appids,function(data){
            res.send(data);
        });
    });

    /**
     * Perform a search
     * @param query {{}}
     */
    app.get('/api/search',function(req,res){
        search.getGame(req.query,function(data){
            res.send(data);
        });
    });

    /**
     * Get search filters
     */
    app.get('/api/filters',function(req,res){
        search.getFields(function(data){
            res.send(data);
        });
    });

    /**
     * Perform a search against steam's search engine
     * @param term {string}
     */
    app.get('/api/steamsearch',function(req,res){
        // /api/storesearch/?term=payday&l=english&cc=SE
        steam_fetch('storesearch/?term=' + req.query.term + '&l=english',function(data){
            res.send(data);
        });
    });

    /**
     * Backbone pass-through route
     */
    app.use(function(req, res){
        res.render('index',index());
    });
};