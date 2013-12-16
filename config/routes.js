var fs = require('fs');
var i18n = require('i18next');
var http = require('http');
var games = require('../app/controller/games');
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

function index(){
    // Render index page and pass through all the variables
    return {
        lang: 'en',
        version: pjson.version,
        models:processed.models,
        collections:processed.collections,
        views:processed.views
    };
}

module.exports = function(app,config){
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
        // /api/storesearch/?term=payday&l=english&cc=SE
        games.getGame(req.query,function(data){
            res.send(data);
        });
    });

    /**
     * Perform a search against steam's search engine
     * @param term {string}
     */
    app.get('/api/steamsearch',function(req,res){
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