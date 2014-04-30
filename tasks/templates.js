var templates = require('../app/modules/templates');

/**
 * Task to add the JADE includes to the main template file
 */
module.exports = function(grunt) {
	grunt.registerTask('buildTemplates', 'Generates the JADE template includes', function(){
        var done = this.async();
		templates(done);
		return true;
	});
};