var fs = require('fs');
/**
 * Task for bamboo to run to generate the docs and build for GitHub Pages
 */
module.exports = function(grunt){
    grunt.registerTask('uploadDocs','Generates the JSDocs and uploads them to GitHub Pages', function(){
        var tasks = ['jsdoc','gh-pages'];

        grunt.task.run(tasks);
    });
};