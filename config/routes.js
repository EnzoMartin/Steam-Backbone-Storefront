var fs = require('fs');
var pjson = require('../package.json');
var config = require('./config');
var i18n = require('i18next');
var http = require('http');
var Q = require('q');

var games = require('../app/controller/games');
var search = require('../app/controller/search');
var steam_fetch = require('../app/modules/steam-url');
var Cache = require('../app/modules/cache');

// Authentication middleware
function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        next();
    } else {
        res.format({
            'text/html': function(){
                req.session.redirectTo = req.originalUrl;
                res.redirect('/login');
            },
            'application/json': function(){
                res.status(401);
                res.send({error:'Not authenticated'});
            }
        });
    }
}


// Global objects to store all the files and modules to include
var requireConfig = require('../config/require')(config.env);

// Set the .min extension for CSS for production only
var ext = config.env === 'development'? '' : '.min';

var gamesList = '{}';
var platformsList = '{}';
var networktypesList = '{}';


// TODO: Move this into a promise/callback correctly
Games.getGames(function(err,games){
    gamesList = JSON.stringify(games);
});

Platforms.getPlatforms(function(err,platforms){
    platformsList = JSON.stringify(platforms);
});

NetworkTypes.getNetworkTypes(function(err,networktypes){
    networktypesList = JSON.stringify(networktypes);
});

var maxAge = 60 * 60 * 24 * 30;

// Specify requirejs URL to load based off the require config
var requireUrl = requireConfig.baseUrl + requireConfig.paths.require + '.js';

/**
 * Get base file definitions and global app data to pass to template
 * @param req {*} Express request object
 * @param [bootstrapped] {*} Pass in data to be stringified and passed to the front end as model/collection bootstrapping
 * @param [locale] string
 * @returns {{bootstrapped: string, loadAllTemplates: boolean, lang: string, requireUrl: string, locale: string, title: string, headline: string, version: string, requireConfig: *}}
 */
function getFiles(req,bootstrapped,locale){
    // TODO: Pass frontend translations
    // Render index page and pass through all the variables
    var data = {
        bootstrapped: '{}',
        loadAllTemplates: config.loadAllTemplates,
        lang: 'en',
        gamesList: gamesList,
        platformsList: platformsList,
        networktypesList: networktypesList,
        requireUrl: requireUrl,
        ext: ext,
        locale: i18n.options.lng,
        title: pjson.title,
        headline: pjson.headline,
        version: pjson.version,
        requireConfig: requireConfig
    };

    var authed = {loggedIn:false};
    if(req.isAuthenticated()){
        var user = req.user;
        authed = {
            username: user.sAMAccountName,
            firstName: user.givenName,
            displayName: user.displayName,
            loggedIn: true
        };
    }
    data.header = authed;

    if(bootstrapped){
        data.bootstrapped = JSON.stringify(bootstrapped);
    }

    // Add google analytics if configured
    if(config.googleAnalytics){
        data.googleAnalytics = config.googleAnalytics
    }

    return data;
}

/**
 * Handle sending the index page or a JSON response, handling the error code
 * @param err {*} Error object
 * @param req {*} Express request object
 * @param res {*} Express response object
 * @param key string Name of response key
 * @param data {*} Data blob
 */
function sendResponse(err,req,res,key,data){
    res.format({
        'text/html': function(){
            var out = {};
            if(err){
                out = {error:err};
            } else {
                out[key] = data;
            }
            res.render('index',getFiles(req,out));
        },
        'application/json': function(){
            if(err){
                res.status(500);
            }
            res.send(data || err);
        }
    });
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

/**
 * @module Express Router
 * @memberOf App
 * @param app {*}
 * @param passport {*}
 */
module.exports = function(app,passport){
    // For development, we reload the module list on every refresh
     if(config.env === 'development'){
        app.use(function(req, res, next){
            requireConfig = requireConfig.getFiles(requireConfig);
            next();
        });
     }

    /**
     * Sends client translations
     */
    app.get('/locales/:locale/:namespace/:ext?',function(req, res){
        var resources = {};

        res.contentType('json');
        if (config.env === 'production') {
            res.header('Cache-Control', 'public max-age=' + maxAge);
            res.header('Expires', (new Date(new Date().getTime() + maxAge * 1000)).toUTCString());
        }

        var languages = req.params.locale ? req.params.locale.split(' ') : [];
        var opts = { ns: { namespaces: req.params.namespace ? req.params.namespace.split(' ') : [] } };

        i18n.sync.load(languages, opts, function() {
            languages.forEach(function(lng) {
                if (!resources[lng]) resources[lng] = {};

                opts.ns.namespaces.forEach(function(ns) {
                    if (!resources[lng][ns]) resources[lng][ns] = i18n.sync.resStore[lng][ns] || {};
                });
            });

            res.send(resources);
        });
    });

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

    // Game detail page bootstrapping, send json response if json request
    app.get('/game/:id?',function(req,res){
        games.getGameById(parseInt(req.params.id,10),function(data){
            res.format({
                'text/html': function(){
                    var files = index();
                    files.bootstrapped = JSON.stringify({games:data});
                    res.render('index',files);
                },
                'application/json': function(){
                    res.send(data);
                }
            });
        });
    });

    /**
     * New Relic ping reply
     */
    app.get('/newrelic',function(req,res){
        res.send({success:true});
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
     * Fetch package details based off ID
     * @param id {string}
     */
    app.get('/api/package',function(req,res){
        steam_fetch('packagedetails?packageids=' + parseInt(req.query.id,10),function(data){
            res.send(data);
        });
    });

    /**
     * Fetch specific app based off ID
     * @param id {string}
     */
    app.get('/api/app',function(req,res){
        games.getGameById(parseInt(req.query.id,10),function(data){
            res.send(data);
        });
    });

    /**
     * Fetch sale page
     * @param id {string}
     */
    app.get('/api/salepage',function(req,res){
        steam_fetch('salepage?id=' + parseInt(req.query.id,10),function(data){
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
     * JSON blob from listener service used to update/create Steam apps in the DB
     * @param secret {string}
     * @param data {{}}
     */
    app.post('/api/populate',function(req,res){
        if(req.body.secret === config.listener_secret){
            if(req.body.data){
                var len = req.body.data.length;
                if(len){
                    var i = 0;
                    while(i < len){
                        games.GameQueue.push(req.body.data[i]);
                        i++;
                    }
                    res.send({success:true,reason:'All\'s shiny. Request ' + req.body.current + ' of ' + req.body.total});
                } else {
                    res.statusCode = 400;
                    res.send({success:false,reason:'"data" object contains no keys'});
                }
            } else {
                res.statusCode = 400;
                res.send({success:false,reason:'No "data" key found for payload parsing'});
            }

            if(req.body.current == req.body.total){
                // Parse the accumulated queue
                games.processQueue();
            }
        } else {
            res.statusCode = 403;
            res.send({success:false,reason:'Auth failure',data:req.body});
        }
    });

    /**
     * Backbone catch-all pass-through route
     */
    if(config.env === 'development'){
        app.use(function(req, res, next){
            if(req.originalUrl.indexOf('js') !== -1){
                res.send({});
            } else {
                res.render('index',getFiles(req),function(err,html) {
                    if(err) {
                        next(err);
                    } else {
                        res.end(html);
                    }
                });
            }
        });
    } else {
        app.use(function(req, res, next){
             res.format({
                'text/html': function(){
                    res.render('index',getFiles(req),function(err,html) {
                        if(err) {
                            next(err);
                        } else {
                            res.end(html);
                        }
                    });
                },
                'application/json': function(){
                    res.status(501);
                    res.send();
                }
            });
        });
    }

    /**
     * Our 500 error page
     */
    if(config.stackError){
        app.use(function(err, req, res, next){
            console.error(err);
            console.trace();
            res.status(500);
            res.format({
                'text/html': function(){
                    res.render('500',{lang:'en',error:err,ext:ext});
                },
                'application/json': function(){
                    res.send({error:err});
                }
            });
        });
    } else {
        app.use(function(err, req, res, next){
            res.status(500);
            res.format({
                'text/html': function(){
                    res.render('500',{auth:false,lang:'en',error:err,ext:ext});
                },
                'application/json': function(){
                    res.send({error:err});
                }
            });
        });
    }
};