var fs = require('fs');

/**
 * Loops through all JADE templates in the templates directory and creates the includes in templates.jade file
 * @param [callback] function
 */
module.exports = function(callback){
    var files = fs.readdirSync('app/views/templates');
    var jade_template = '';
    var i = 0;
    var len = files.length;
    while (i < len) {
        var file = files[i].replace('.jade','');
        jade_template += 'script#' + file + '(type="text/html",class="dust-template")\n';
        jade_template += '	include templates/' + file + ' \n \n';
        i++;
    }
    fs.writeFileSync('app/views/templates.jade', jade_template);
    if(typeof callback === 'function'){
        console.log('Finished compiling ' + len + ' templates');
        callback();
    }
};