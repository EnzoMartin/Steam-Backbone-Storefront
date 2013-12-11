var express = require('express');
var fs = require('fs');
var passport = require('passport');

// Load configurations
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];
var auth = {}; //require('./config/middlewares/authorization');
//var mongoose = require('mongoose');

// TODO: Add the database layer stuff
// Bootstrap db connection
//mongoose.connect(config.db);

if(config.generate_templates){
    // Generate all the templates
    var templates = require('./app/modules/templates');
    templates();
}

// Bootstrap models
var models_path = __dirname + '/app/models';
fs.readdirSync(models_path).forEach(function(file){
	require(models_path + '/' + file);
});

// TODO: Add user handling later
// bootstrap passport config
//require('./config/passport')(passport,config);

var app = express();
// express settings
require('./config/express')(app,config,passport);

// Bootstrap routes
require('./config/routes')(app,config,passport,auth);

// Start the app by listening on <port>
var port = process.env.PORT || 3000;
app.listen(port);

console.log('Express app started on port ' + port);