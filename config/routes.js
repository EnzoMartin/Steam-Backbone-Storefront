//var mongoose = require('mongoose');
//var User = mongoose.model('User');
var fs = require('fs');
var i18n = require('i18next');

module.exports = function(app,config,passport,auth){
	// User Routes
	/*var users = require('../app/controllers/users');
	app.get('/login',users.login);
	app.get('/signup',users.signup);
	app.get('/logout',users.logout);
	app.post('/users',users.create);
	app.post('/users/session',passport.authenticate('local',{failureRedirect: '/login',failureFlash: 'Invalid email or password.'}),users.session);
	app.get('/users/:userId',users.show);
	app.get('/auth/google',passport.authenticate('google',{failureRedirect: '/login',scope: 'https://www.google.com/m8/feeds'}),users.signin);
	app.get('/auth/google/callback',passport.authenticate('google',{failureRedirect: '/login',scope: 'https://www.google.com/m8/feeds'}),users.authCallback);

	app.param('userId',function(req,res,next,id){
		User
			.findOne({ _id: id })
			.exec(function(err,user){
				if(err) return next(err);
				if(!user) return next(new Error('Failed to load User ' + id));
				req.profile = user;
				next();
			});
	});*/

	// Home Route
    app.get('/:locale?',function(req,res){
        // Handle switching language
        var locale = (req.params.locale || 'en-US').split('-');
        if(locale.length != 2){
            locale = ['en','US'];
        }
        req.i18n.setLng(locale[0] + '-' + locale[1].toUpperCase());

        // Load all the JS files for backbone
        var files = {};
        files.views = fs.readdirSync('public/js/views');
        files.models = fs.readdirSync('public/js/models');
        var processed = {};

        for (var i in files) {
            var j = 0;
            processed[i] = '';
            while(j < files[i].length){
                var file = files[i][j];
                if(file.indexOf('.js') != -1){
                    processed[i] += '\'/js/' + i + '/' + file + '\'' + ',\n';
                }
                j++;
            }
        }
        // Render index page and pass through all the variables
        res.render('index',{
            lang: locale[0],
            models:processed.models,
            views:processed.views
        });
    })
};