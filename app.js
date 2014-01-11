var express = require('express');

if(process.env.NEWRELIC){
    // Load new relic only if the API key is set
    require('newrelic');
}

if(process.env.RUN_STEAM_LISTENER){
    var Steam = require('steam');
    var Listener = Steam.SteamClient();

    Listener.logOn({
        accountName: process.env.STEAM_USER,
        password: process.env.STEAM_PASSWORD
    });

    Listener.on('loggedOn',function(){
        console.log('Logged in to Steam!');
    });

    Listener.on('servers',function(servers){
        console.log('got servers',servers);
    });

    Listener.on('fromGC',function(id,type,body){
        console.log('GC arguments',JSON.stringify(arguments));
        console.log('GC Message', id, type);
        console.log('GC Body',body);
    });
}

// Load configurations
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];

// Connect to mongo
var db = require('./app/modules/database')(config);

// Connect to Azure Cache
if(process.env.CACHE_ENDPOINT){
    require('./app/modules/cache')();
} else {
    // If no Cache configured, this puts dummy functions in it's place
    require('./app/modules/cache')(true);
}

if(config.generate_templates){
    // Generate all the templates
    var templates = require('./app/modules/templates');
    templates();
}

var app = express();
// Express settings
require('./config/express')(app,config);

// Express routes
require('./config/routes')(app,config);

// Start
app.listen(config.port);

if(config.expressLog){
    console.log('Express app started on port ' + config.port);
}