var socketio = require('socket.io');
var config = require('../../config/config');
var passportSocketIo = require('passport.socketio');
var cookieParser = require('cookie-parser');

/**
 * Start the socket server
 * @param http {*} Express application object
 * @param sessionStore {*} Session store object
 */
module.exports = function(http,sessionStore){
    var io = socketio.listen(http,{log: config.socketLog});
    io.set('log level', config.socketLogLevel);

    /*io.of('/app').authorization(passportSocketIo.authorize({
        cookieParser: cookieParser,
        key: 'backbone.sid',
        secret: config.secret,
        store: sessionStore
    }));*/

    io.of('/app').on('connection',function(socket){
        socket.on('version',function(version){
            if(version != config.version){
                socket.emit('reload');
            }
        });
    });

    return module.exports = io;
};