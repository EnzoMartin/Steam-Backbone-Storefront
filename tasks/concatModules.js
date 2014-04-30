var fs = require('fs');

function unique(value, index, self) {
    return self.indexOf(value) === index;
}

/**
 * @name Concat RequireJS Module
 * @desc Concatenates the RequireJS modules properly into 1 file
 */
module.exports = function(grunt){
    grunt.registerTask('concatModules',function(){
        var argsRe = new RegExp(/function\((.+?)\)/);
        var modulesRe = new RegExp(/define\(\[(.+?)\]/);

        var locales = fs.readdirSync('.grunt/.require');
        locales.forEach(function(locale){
            var localePath = '.grunt/.require/' + locale;
            if(fs.lstatSync(localePath).isDirectory()){
                var files = fs.readdirSync(localePath);
                files.forEach(function(file){
                    var contents = fs.readFileSync('.grunt/.require/' + locale + '/' + file);

                    var startDefine = null;
                    var returnLines = [];
                    var defineLines = [];
                    var contentsArray = contents.toString().split('\n');

                    var dependencies = [];
                    var variables = [];

                    contentsArray.forEach(function(line,num){
                        // Determine if the line is the start of a new define
                        if(line.indexOf('define(') !== -1){
                            if(startDefine === null){
                                startDefine = num;
                            } else {
                                defineLines.push(num);
                            }

                            // Get the dependencies for the define
                            var lineModules = line.match(modulesRe);
                            if(lineModules[1]){
                                lineModules[1].split(',').forEach(function(mod){
                                    dependencies.push(mod.trim());
                                });
                            }

                            // Get the arguments for the define
                            var lineArguments = line.match(argsRe);
                            if(lineArguments[1]){
                                lineArguments[1].split(',').forEach(function(arg){
                                    variables.push(arg);
                                });
                            }
                        }

                        // Get each line that has a return
                        if(startDefine != null){
                            if(line.indexOf('return BB.') !== -1){
                                returnLines.push(num);
                            }
                        }
                    });

                    // Remove the returns
                    returnLines.forEach(function(num){
                        contentsArray[num] = contentsArray[num].replace('return BB.','BB.');
                    });

                    // Add the return on the before last line
                    contentsArray[contentsArray.length-1] = 'return BB;\n});';

                    // Re-write the define
                    var prefix = contentsArray[startDefine].substring(0,contentsArray[startDefine].indexOf('define'));
                    contentsArray[startDefine] = prefix + 'define("' + file.replace('.js','') + '",[' + dependencies.filter(unique).join(',') + '], function(' + variables.filter(unique).join(',') + '){';

                    // Remove other defines
                    defineLines.forEach(function(num){
                        contentsArray[num] = '';
                    });

                    var newContents = contentsArray.join('\n');

                    fs.writeFileSync('.grunt/.modules/' + locale + '/' + file,newContents);
                });
            }
        });
    });
};