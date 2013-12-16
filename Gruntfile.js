var templates = require('./app/modules/templates');

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
};