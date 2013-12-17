var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];
var templates = require('./app/modules/templates');

// Connect to database
require('./app/modules/database')(config);
var db = require('./app/modules/database');
var Games = require('./app/controller/games');
var GamesIndex = db.collection('games');
var Indexer = require('./app/modules/index');
var SteamURL = require('./app/modules/steam');
var timer = '';

/**
 * Fetches a game and starts a new 2 seconds timer if specified
 * @param games {{}}
 * @param current number
 * @param callback function
 **/
function getGame(games,current,callback){
    var game = games[current];
    current++;
    console.log('Updating game ID: ' + game.steam_appid + ' - ' + current + ' of ' + games.length);
    Games.fetchParseGame(game.steam_appid, function(){return null;},game._id);
    if(typeof games[current] !== 'undefined'){
        setTimeout(function(){
            getGame(games,current,callback);
        },2000);
    } else {
        console.timeEnd(timer);
        callback();
    }
}

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dist: {
				files: {
					'public/css/structure.css': 'scss/structure.scss'
				},
				options: {
					compass: true,
					style: 'compressed'
				}
			},
			dev: {
				files: {
					'public/css/structure.css': 'scss/structure.scss'
				},
                options: {
					quiet: true,
					compass: true,
					style: 'expanded',
					lineNumbers: true
				}
			}
		},
        uglify: {
            files: [
                {
                    expand: true,
                    cwd: 'src/js',
                    src: '**/*.js',
                    dest: 'dest/js'
                }
            ]
        },
		watch: {
			templates: {
				files: [
					'app/views/templates/**'
				],
				tasks: [
					'build_templates'
				],
				options: {
					nospawn: true
				}
            },
            css: {
                files: [
					'scss/**'
				],
				tasks: [
					'sass:dev'
				],
				options: {
					nospawn: true
				}
            }
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');

	// Default task
	grunt.registerTask('default', [
		'sass:dev',
		'build_templates',
        'watch'
	]);

	// Add the JADE includes
	grunt.registerTask('build_templates', 'Generates the JADE template includes', function(){
		templates();
		return true;
	});

    grunt.registerTask('update_games', 'Updates all the games in the DB by fetching from Steam', function(){
        var done = this.async();
        GamesIndex.find(function(err, games){
            timer = 'Done, updated ' + games.length + ' games in';
            console.time(timer);
            getGame(games,0,done);
        });
    });
};