if(process.env.NEWRELIC){
    // Load new relic only if the API key is set
    require('newrelic');
}

var express = require('express');
var fs = require('fs');

// Load configurations
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];

// Connect to mongo
var db = require('./app/modules/database')(config);

// Connect to Azure Cache
if(process.env.CACHE_ENDPOINT){
    require('./app/modules/cache')();
} else {
    require('./app/modules/cache')(true);
}

if(config.generate_templates){
    // Generate all the templates
    var templates = require('./app/modules/templates');
    templates();
}

var app = express();
// express settings
require('./config/express')(app,config);

// Bootstrap routes
require('./config/routes')(app,config);

// Start the app by listening on <port>
var port = config.port;
app.listen(port);

console.log('Express app started on port ' + port);