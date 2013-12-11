var fs = require('fs');

module.exports = function(){
    var files = fs.readdirSync('app/views/templates');
    var jade_template = '';
    var i = 0;
    while (i < files.length) {
        var file = files[i].replace('.jade','');
        jade_template += 'script#' + file + '(type="text/html",class="dust-template")\n';
        jade_template += '	include templates/' + file + ' \n \n';
        i++;
    }
    fs.writeFileSync('app/views/templates.jade', jade_template);
};