var config = require('../../config/config');
var databaseUrl = 'mysql://' + config.db.user + ':' + config.db.password + '@' + config.db.host + ':' + config.db.port + '/' + config.db.database;

module.exports = {
    options: {
        env: {
            DATABASE_URL: databaseUrl
        },
        dir: 'migrations',
        verbose: true
    }
};