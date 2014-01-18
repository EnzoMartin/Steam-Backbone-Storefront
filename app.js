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

// Connect to Azure Cache
if(config.use_cache){
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