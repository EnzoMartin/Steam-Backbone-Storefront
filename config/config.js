module.exports = {
    development:{
        root: require('path').normalize(__dirname + '/..'),
        port: 3000,
		db: 'mongodb://localhost/steam',
        secret: 'c0g8+em8x%@=45%^kdrn=&+$1qgw91dsn@a6z3pwoyx_&y++fs',
        generate_templates: false,
        expressLog: false,
        il8nDebug: false
    },
    staging:{
        root: require('path').normalize(__dirname + '/..'),
        port: process.env.PORT,
		db: process.env.MONGO,
		secret: process.env.SECRET,
        generate_templates: true,
        expressLog: false,
        il8nDebug: false
    },
    test:{
        // Unit tests config
    },
    production:{
        root: require('path').normalize(__dirname + '/..'),
        port: process.env.PORT,
        db: process.env.MONGO,
        secret: process.env.SECRET,
        generate_templates: true,
        expressLog: false,
        il8nDebug: false
    }
};
