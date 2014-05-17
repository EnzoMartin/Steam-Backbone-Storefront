/**
 * @namespace App
 * @desc The main NodeJS application file
 * @type {exports}
 */
var express = require('express');
var passport = require('passport');

if(process.env.NEWRELIC){
    // Load new relic only if the API key is set
    require('newrelic');
}

// Load configurations
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')(env);

// Run DB migration if not dev/test
console.log('Running in "%s" mode',env);
/*if(env !== 'development' && env !== 'test'){
    console.log('Provisioning database');
    var sys = require('sys');
    var exec = require('child_process').exec;
    function puts(error, stdout, stderr){
        if(error){
            console.error(error);
        } else {
            console.log(stdout);
        }
    }
    var command = '/usr/local/bin/node node_modules/db-migrate/bin/db-migrate up --env ' + env + ' --config ./config/database.json --verbose';
    console.log('Executing command: "%s"',command);
    exec(command,puts);
}*/

// Connect to MySQL
require('./app/modules/nosql')(function(){
    var session = require('express-session');
    var MySQLStore = require('connect-mysql')({session:session});

    var app = express();

    var sessionStore = new MySQLStore({config:config.db});

    // Express settings
    require('./config/express')(app,passport,sessionStore);

    // Express routes
    require('./config/routes')(app,passport);

    // Start
    var http = app.listen(config.port);

    // Start socket layer
    //require('./app/modules/sockets')(http,sessionStore);

    // Start
    if(env == 'development'){
        console.log('Application started on: http://localhost:' + config.port);
    } else {
        console.log('Application started on port:' + config.port);
    }
});