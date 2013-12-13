if(process.env.NEWRELIC){
    // Load new relic only if the API key is set
    require('newrelic');
}

var express = require('express');
var fs = require('fs');
var passport = {}; //require('passport');

// Load configurations
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];
var auth = {}; //require('./config/middlewares/authorization');

// Connect to mongo
var db = require('./app/modules/database').connect(config);

if(config.generate_templates){
    // Generate all the templates
    var templates = require('./app/modules/templates');
    templates();
}

// TODO: Add user handling later
// bootstrap passport config
//require('./config/passport')(passport,config);

var app = express();
// express settings
require('./config/express')(app,config,passport);

// Bootstrap routes
require('./config/routes')(app,config,passport,auth);

// Start the app by listening on <port>
var port = config.port;
app.listen(port);

console.log('Express app started on port ' + port);