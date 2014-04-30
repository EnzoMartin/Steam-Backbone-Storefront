/**
 * Task to compile the CSS and template files on file change
 */
module.exports = function(grunt) {
    grunt.registerTask('default','Runs the SCSS compile and template builds',function(){
        var config = require('./options/watch');
        delete config.server;

        var tasks = [
            'sass:dev',
            'buildTemplates',
            'watch'
        ];

        grunt.option('force', true);
        grunt.config('watch',config);
        grunt.task.run(tasks);
    });
};