module.exports = {
    development:{
        root: require('path').normalize(__dirname + '/..'),
        port: 3000,
		cloudant_url: 'http://user:password@127.0.0.1:5984/',
		cloudant_user: 'root',
		cloudant_password: 'root',
        secret: 'c0g8+em8x%@=45%^kdrn=&+$1qgw91dsn@a6z3pwoyx_&y++fs',
        generate_templates: false,
        listener_secret: 'test',
        stackError: true,
        expressLog: true,
        il8nDebug: false,
        expressLogLevel: 'dev'
    },
    staging:{
        root: require('path').normalize(__dirname + '/..'),
        port: process.env.PORT,
		cloudant_url: process.env.CLOUDANT_URL,
		cloudant_user: process.env.CLOUDANT_USER,
		cloudant_password: process.env.CLOUDANT_PASSWORD,
		secret: process.env.SECRET,
        generate_templates: true,
        listener_secret: process.env.LISTENER_SECRET,
        stackError: false,
        expressLog: false,
        il8nDebug: false,
        expressLogLevel: 'dev'
    },
    test:{
        // Unit tests config
    },
    production:{
        root: require('path').normalize(__dirname + '/..'),
        port: process.env.PORT,
        cloudant_url: process.env.CLOUDANT_URL,
		cloudant_user: process.env.CLOUDANT_USER,
		cloudant_password: process.env.CLOUDANT_PASSWORD,
        secret: process.env.SECRET,
        generate_templates: true,
        listener_secret: process.env.LISTENER_SECRET,
        stackError: false,
        expressLog: false,
        il8nDebug: false,
        expressLogLevel: 'dev'
    }
};
