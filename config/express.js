var express = require('express');
//var mongoStore = require('connect-mongo')(express);
var viewHelpers = require('./middlewares/view');
var i18n = require('i18next');

module.exports = function(app,config,passport){
    i18n.init({
        resGetPath: './locales/__lng__/__ns__.json',
        fallbackLng: 'en-US',
        ns: 'translations',
        saveMissing: true,
        ignoreRoutes: ['api/','img/', 'public/', 'css/', 'js/'],
        debug: config.il8nDebug
    });

	app.set('showStackError',true);
	app.use(express.compress(
		{
			filter: function(req,res){
				return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
			},
			level: 9
		}
	));
	app.use(express.static(config.root + '/public'));
	if(config.expressLog){
        app.use(express.logger('dev'));
    }

	// set views path, template engine and default layout
	app.set('view options',{layout: false});
	app.set('views',config.root + '/app/views');
	app.set('view engine','jade');

	app.configure(function(){
		// dynamic helpers
		app.use(viewHelpers(config));

		// cookieParser should be above session
		app.use(express.cookieParser());

		// bodyParser should be above methodOverride
		app.use(express.bodyParser());
        app.use(i18n.handle);
		app.use(express.methodOverride());

		// express/mongo session storage
		/*app.use(express.session(
			{
				secret: config.secret,
				store: new mongoStore(
					{
						url: config.db,
						collection: 'sessions'
					}
				)
			}
		));*/

		// use passport session
		//app.use(passport.initialize());
		//app.use(passport.session());

		app.use(express.favicon());

		// routes should be at the last
		app.use(app.router);

		// assume "not found" in the error msgs
		// is a 404. this is somewhat silly, but
		// valid, you can do whatever you like, set
		// properties, use instanceof etc.
		app.use(function(err,req,res,next){
			// treat as 404
			if(~err.message.indexOf('not found')) return next();
			// log it
			console.error(err.stack);
			// error page
			res.status(500).render('500',{ error: err.stack });
		});

		// assume 404 since no middleware responded
		app.use(function(req,res,next){
			res.status(404).render('404',{ url: req.originalUrl });
		})
	});

    i18n.registerAppHelper(app);
};