var pjson = require('../package.json');

var configs = {
    development:{
        root: require('path').normalize(__dirname + '/..'),
        port: 3000,
        secret: 'c0g8+em8x%@=45%^kdrn=&+$1qgw91dsn@a6z3pwoyx_&y++fs',
        googleAnalytics: false,
        db: {
            host: '127.0.0.1',
            user: 'root',
            port: 3306,
            password: 'root',
            database: 'steam-backbone'
        },
        loadAllTemplates: true,
        stackError: true,
        prettyHTML: true,
        expressLog: true,
        il8nDebug: false,
        socketLog: false,
        socketLogLevel: 3,
        expressLogLevel: 'dev',
		cloudant_url: 'http://user:password@127.0.0.1:5984/',
		cloudant_user: 'root',
		cloudant_password: 'root',
        use_cache: false,
        listener_secret: 'test'
    },
    staging:{
        root: require('path').normalize(__dirname + '/..'),
        port: process.env.PORT || 3000,
		secret: process.env.SECRET || 'c0g8+em8x%@=45%^kdrn=&+$1qgw91dsn@a6z3pwoyx_&y++fs',
        googleAnalytics: false,
        db: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            port: process.env.DB_PORT || 3306,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        },
        loadAllTemplates: false,
        stackError: false,
        prettyHTML: false,
        expressLog: false,
        il8nDebug: false,
        socketLog: false,
        socketLogLevel: 1,
        expressLogLevel: 'dev',
		cloudant_url: process.env.CLOUDANT_URL,
		cloudant_user: process.env.CLOUDANT_USER,
		cloudant_password: process.env.CLOUDANT_PASSWORD,
        use_cache: process.env.USE_CACHE,
        listener_secret: process.env.LISTENER_SECRET
    },
    test:{
        root: require('path').normalize(__dirname + '/..'),
        port: process.env.PORT || 8000,
		secret: process.env.SECRET || 'c0g8+em8x%@=45%^kdrn=&+$1qgw91dsn@a6z3pwoyx_&y++fs',
        reporter: process.env.MOCHA_REPORTER || 'spec',
        googleAnalytics: false,
        db: {
            host: process.env.DB_HOST || '127.0.0.1',
            user: process.env.DB_USER || 'root',
            port: process.env.DB_PORT || 3306,
            password: process.env.DB_PASSWORD || 'root',
            database: process.env.DB_DATABASE || 'steam-backbone'
        },
        loadAllTemplates: false,
        stackError: true,
        prettyHTML: false,
        expressLog: true,
        il8nDebug: false,
        socketLog: false,
        socketLogLevel: 1,
        expressLogLevel: 'dev',
		cloudant_url: process.env.CLOUDANT_URL,
		cloudant_user: process.env.CLOUDANT_USER,
		cloudant_password: process.env.CLOUDANT_PASSWORD,
        use_cache: process.env.USE_CACHE,
        listener_secret: process.env.LISTENER_SECRET
    },
    production:{
        root: require('path').normalize(__dirname + '/..'),
        port: process.env.PORT || 80,
		secret: process.env.SECRET || 'c0g8+em8x%@=45%^kdrn=&+$1qgw91dsn@a6z3pwoyx_&y++fs',
        googleAnalytics: false,
        db: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            port: process.env.DB_PORT || 3306,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        },
        loadAllTemplates: false,
        stackError: false,
        prettyHTML: false,
        expressLog: false,
        il8nDebug: false,
        socketLog: false,
        socketLogLevel: 1,
        expressLogLevel: 'dev',
        cloudant_url: process.env.CLOUDANT_URL,
		cloudant_user: process.env.CLOUDANT_USER,
		cloudant_password: process.env.CLOUDANT_PASSWORD,
        use_cache: process.env.USE_CACHE,
        listener_secret: process.env.LISTENER_SECRET
    }
};

/**
 * @module App Config
 * @memberOf App
 * @param environment string
 * @returns {*} Current config options based off environment, including the active environment name
 */
module.exports = function(environment){
    var config = configs[environment] || configs[Object.keys(configs)[0]];
    config.env = environment;
    config.version = pjson.version;
    return module.exports = config;
};