var http = require('http');
var url = 'store.steampowered.com';

module.exports = function(fragment,callback){
    var options = {
        host: url,
        path: '/api/' + fragment
    };

    http.request(options,function(response){
        var str = '';
        response.on('data',function(chunk){
            str += chunk;
        });

        response.on('end',function(){
            callback(str);
        });
    }).end();
};