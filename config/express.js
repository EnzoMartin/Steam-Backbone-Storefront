var express = require('express');
var i18n = require('i18next');

module.exports = function(app,config){
    i18n.init({
        resGetPath: './locales/__lng__/__ns__.json',
        fallbackLng: 'en-US',
        ns: 'translations',
        saveMissing: true,
        ignoreRoutes: ['api/','img/', 'public/', 'css/', 'js/'],
        debug: config.il8nDebug
    });

	app.set('showStackError',config.stackError);
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
        app.use(express.logger(config.expressLogLevel));
    }

	// set views path, template engine and default layout
	app.set('view options',{layout: false});
	app.set('views',config.root + '/app/views');
	app.set('view engine','jade');

	app.configure(function(){
		// cookieParser should be above session
		app.use(express.cookieParser());

		// bodyParser should be above methodOverride
		app.use(express.bodyParser());
        app.use(i18n.handle);
		app.use(express.methodOverride());
		app.use(express.favicon());

		// routes should be at the last
		app.use(app.router);
	});

    i18n.registerAppHelper(app);
};