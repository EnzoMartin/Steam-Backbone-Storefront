module.exports = {
    development:{
        root:require('path').normalize(__dirname + '/..'),
		//db:'mongodb://user:password@localhost:27017/database',
        generate_templates: false,
        expressLog: false,
        google: {
            clientID: "APP_ID",
            clientSecret: "APP_SECRET",
            callbackURL: "http://localhost:3000/auth/google/callback"
        }
    },
    staging:{
        root:require('path').normalize(__dirname + '/..'),
		//db:'mongodb://user:password@localhost:27017/database',
        expressLog: false,
        generate_templates: true,
        google: {
            clientID: "APP_ID",
            clientSecret: "APP_SECRET",
            callbackURL: "http://localhost:3000/auth/google/callback"
        }
    },
    test:{
        // Unit tests config
    },
    production:{
        // Live environment
        expressLog: false
    }
};
