var express = require('express');

if(process.env.NEWRELIC){
    // Load new relic only if the API key is set
    require('newrelic');
}

// Load configurations
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];

// Connect to mongo
require('./app/modules/database')(config);

if(process.env.RUN_STEAM_LISTENER){
    var db = require('./app/modules/database');
    var Steam = require('steam');
    var Servers = db.collection('steam_servers');
    Servers.findOne({},function(err,data){
        // Update the server list if we have it in the DB
        if(data){
            console.log('Found saved server list');
            Steam.servers = data.list;
        }

        Listener.logOn({
            accountName: process.env.STEAM_USER,
            password: process.env.STEAM_PASSWORD
        });
    });
    var Listener = new Steam.SteamClient();

    Listener.on('loggedOn',function(){
        console.log('Logged in to Steam');
    });

    Listener.on('servers',function(list){
        console.log('Got updated server list, total: ',list.length);
        // Empty the collection and add new servers
        Servers.remove();
        Servers.save({list:list});
    });

    Listener.on('fromGC',function(id,type,body){
        console.log('GC arguments',JSON.stringify(arguments));
        console.log('GC Message', id, type);
        console.log('GC Body',body);
    });

    Listener.on('message',function(){
        console.log('Message arguments',JSON.stringify(arguments));
    });

    Listener.on('error',function(error){
        console.log('Error occurred: ',error);
    });
}

// Connect to Azure Cache
if(process.env.CACHE_ENDPOINT){
    // If using Azure Cache, make sure to install Edge and run "node_modules\azurecache\tools\install.bat"
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