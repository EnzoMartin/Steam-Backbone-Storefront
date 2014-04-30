/**
 * Task to generate the JSDoc documentation files
 */
module.exports = function(grunt) {
    grunt.registerTask('doc','Generates the JSDocs', function(){
        var tasks = ['clean:doc','jsdoc'];

        grunt.task.run(tasks);
    });
};