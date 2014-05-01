var express = require('express');
var i18n = require('i18next');
var config = require('../config/config');
var compress = require('compression');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var favicon = require('static-favicon');

/**
 * @module Express App
 * @param app {*}
 * @param passport {*}
 * @param sessionStore {*}
 */
module.exports = function(app,passport,sessionStore){
    i18n.init({
        resGetPath: './locales/__lng__/__ns__.json',
        fallbackLng: 'en-US',
        ns: 'server',
        saveMissing: true,
        ignoreRoutes: ['api/','img/', 'public/', 'css/', 'js/'],
        debug: config.il8nDebug
    });

	app.set('showStackError',config.stackError);
	app.use(compress({
        filter: function(req,res){
            return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    // Set whether to prettify HTML
    app.locals.pretty = config.prettyHTML;

	app.use(express.static(config.root + '/public'));

    // Set the log level
	if(config.expressLog){
        app.use(logger(config.expressLogLevel));
    }

	// Set views path, template engine and default layout
	app.set('view options',{layout: false});
	app.set('views',config.root + '/app/views');
	app.set('view engine','jade');

    app.use(cookieParser());
    app.use(bodyParser());
    /*app.use(session({
        secret: config.secret,
        key: 'playtestmate.sid',
        store: sessionStore
    }));*/

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(i18n.handle);
    app.use(methodOverride());
    app.use(favicon());

    // Register our localization and set up the client serve
    i18n.registerAppHelper(app).serveClientScript(app).serveDynamicResources(app);
};