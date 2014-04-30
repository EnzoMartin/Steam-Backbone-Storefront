/**
 * @name packages task
 * @desc 
 */
module.exports = function(grunt){
    grunt.registerTask('bamboo',function(){
        var tasks = [
            'clean:bower',
            'bower:install',
            'bowercopy',
            'clean:bamboo'
        ];

        grunt.task.run(tasks);
    });
};