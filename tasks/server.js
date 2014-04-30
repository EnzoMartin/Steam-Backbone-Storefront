/**
 * Task to start the node application with watcher on JS files
 */
module.exports = function(grunt){
    grunt.registerTask('server','Starts the node server',function(){
        // We just want the server watch task
        var config = require('./options/watch').server;
        var tasks = [
            'sass:dev',
            'buildTemplates',
            'develop',
            'watch'
        ];

        grunt.config('watch',config);
        grunt.task.run(tasks);
    });
};