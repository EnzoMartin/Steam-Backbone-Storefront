/**
 * @name packages task
 * @desc 
 */
module.exports = function(grunt){
    grunt.registerTask('packages',function(){
        var tasks = [
            'clean:bower',
            'bower:install',
            'bowercopy'
        ];

        grunt.task.run(tasks);
    });
};