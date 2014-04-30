var fs = require('fs');

/**
 * @name Generate JS Bundles
 * @desc 
 */
module.exports = function(grunt){
    grunt.registerTask('makeBundles','Package all the various frontend files into modules',function(){
        // Setup our tasks
        var tasks = [
            'clean:modules',
            'copy:templates',
            'jade:dist',
            'copy:locales',
            'i18n:dist',
            'dust:dist',
            'concat:modules',
            'concat:templates',
            'concat:dist',
            'uglify:modules',
            'concatModules',
            'sass:dist',
            'copy:app',
            'clean:dist',
            'uglify:dist',
            //'cssmin',
            'clean:final'
        ];

        // Our grunt build directory
        var writeDir = '.grunt/.build';

        // Where all the JS files live for the Backbone application
        var dir = 'public/js/app';

        // Get all of our module names
        var modules = fs.readdirSync(dir);
        grunt.log.writeln(modules.length + ' modules to compile');

        // Get the Copy config
        var copyConfig = grunt.config('copy');

        // Get the Concat config
        var concatConfig = grunt.config('concat');

        // Get the Uglify config
        var uglifyConfig = grunt.config('uglify');

        // Get the JADE config
        var jadeConfig = grunt.config('jade');

        // Get the Dust config
        var dustConfig = grunt.config('dust');

        // Get all our locales
        var locales = fs.readdirSync('locales');
        grunt.log.writeln(locales.length + ' locales to compile');

        // Iterate over the modules
        modules.forEach(function(moduleName){
            var filesPath = dir + '/' + moduleName;
            var moduleFile = writeDir + '/' + moduleName + '.js';
            var filePaths = [];

            // Get the files in our module
            var files = fs.readdirSync(filesPath);
            files.forEach(function(file){
                var filePath = filesPath + '/' + file;

                // Find all the templates used in the views
                if(file.indexOf('view') !== -1){
                    var templates = fs.readFileSync(filePath,'utf8').match(/tpl_\w+/g);
                    var templateConfig = {
                        expand:true,
                        flatten:true,
                        src:[],
                        dest:'.grunt/.templates/' + moduleName
                    };

                    // Append the templates we need to copy
                    templates.forEach(function(template){
                        templateConfig.src.push('app/views/templates/' + template + '.jade');

                        // Set up the templates to compile to HTML
                        jadeConfig.dist.files['.grunt/.templates/' + moduleName + '/' + template + '.html'] = '.grunt/.templates/' + moduleName + '/' + template + '.jade';
                    });

                    // Append the copy config for the templates
                    copyConfig.templates.files.push(templateConfig);

                    // Set up the Dust compiles for the localized HTML files that will get generated
                    dustConfig.dist.files.push({
                        expand: true,
                        cwd: '.grunt/.localized/',
                        src: ['**/' + moduleName + '/*.html'],
                        dest: '.grunt/.localized',
                        ext: '.js'
                    });
                }

                // Get each file we need to concat
                filePaths.push(filePath);

                locales.forEach(function(locale){
                    // Concat the templates together
                    concatConfig.templates.files['.grunt/.localized/' + locale + '/' + moduleName + '.js'] = ['.grunt/.localized/' + locale + '/' + moduleName + '/*.js'];
                });
            });

            // Create the concat step for grunt for the module
            concatConfig.modules.files[moduleFile] = filePaths;

            locales.forEach(function(locale){
                // Concat the templates and modules together
                concatConfig.dist.files['.grunt/.modules/' + locale + '/' + moduleName + '.js'] = ['.grunt/.localized/' + locale + '/' + moduleName + '.js','.grunt/.build/' + moduleName + '.js'];
            });
        });

        // Delete everything in the templates.jade file
        fs.truncateSync('./app/views/templates.jade', 0);

        // Set our new configs
        grunt.config('concat',concatConfig);
        grunt.config('uglify',uglifyConfig);
        grunt.config('copy',copyConfig);
        grunt.config('jade',jadeConfig);
        grunt.config('dust',dustConfig);

        // Run it!
        grunt.task.run(tasks);
    });
};