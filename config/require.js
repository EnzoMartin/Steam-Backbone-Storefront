var fs = require('fs');
var pjson = require('../package.json');

// Configurations shared across all environments
var shared = {
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'dust': {
            deps: ['dust-helpers'],
            exports: 'dust'
        },
        'dust-dump': ['dust-helpers'],
        'dust-helpers': ['dust-full'],
        'jqueryui': ['jquery'],
        'bootstrap': ['jquery'],
        'i18next': {
            exports: 'i18n'
        },
        'router': [
            'backbone',
            'BBA'
        ],
        'BB': ['backbone'],
        'BBA': ['BB'],
        'underscore': {
            exports: '_'
        },
        'translations': {
            exports: 'locales'
        }
    },
    map: {
        '*': {
            'BB': 'backbone-helper',
            'BBA': 'main'
        }
    },
    paths: {
        i18next: '/i18next/i18next',
        //translations: ['/locales/#{locale}/translations'],
        dust: 'libraries/dust-iterate-helper',
        'dust-dump': 'libraries/dust-contextdump-helper'
    }
};

var configs = {
    development: {
        urlArgs: (new Date().getTime() / 1000).toFixed(0),
        baseUrl: '/js/', // Plus the locale added in the express router
        map: {
            // Set overrides
        },
        paths: {
            lib: 'lib',
            main: 'main',
            router: 'router'
        },
        shim: {
            // Set overrides
        }
    },
    test: {
        urlArgs: pjson.version,
        baseUrl: '/js/dist/',
        map: {
            // Set overrides
        },
        paths: {
            //translations: ['/locales/#{locale}/translations'],
            dust: '../libraries/dust-iterate-helper',
            'dust-dump': '../libraries/dust-contextdump-helper',

            // Local libs
            lib: 'lib.min',
            main: 'main.min',
            router: 'router.min'
        },
        shim: {
            // Set overrides
        }
    },
    production: {
        urlArgs: pjson.version,
        baseUrl: process.env.CDN_URL || pjson.CDN_URL || '/js/dist/', // CDN_URL in package.json is set if application was deployed by Grunt
        map: {
            // Set overrides
        },
        paths: {
            //translations: ['/locales/#{locale}/translations'],
            dust: ['../libraries/dust-iterate-helper'],
            'dust-dump': ['../libraries/dust-contextdump-helper'],

            // Local libs
            lib: ['lib.min'],
            main: ['main.min'],
            router: ['router.min']
        },
        shim: {
            // Set overrides
        }
    }
};

/**
 * Adds all the modules and files to the config
 * @param config {*}
 * @param [environment]
 * @returns {*}
 */
function getFiles(config,environment){
    environment = environment || config.environment;

    var dir = 'libraries/bower/';
    var bowerDir = environment === 'development'? 'public/js/' + dir : 'public/js/dist/' + dir;
    var libraries = fs.readdirSync(bowerDir);

    libraries.forEach(function(library){
        if(library.indexOf('.map') === -1){
            library = library.replace('.js','');
            config.paths[library.replace('.min','')] = dir + library;
        }
    });

    var s = 0;
    var sKeys = Object.keys(shared);
    var sLen = sKeys.length;
    while(s < sLen){
        var shareKey = sKeys[s];
        var share = shared[shareKey];

        var k = 0;
        var keys = Object.keys(share);
        var kLen = keys.length;

        if(!config[shareKey]){
            config[shareKey] = share;
        } else {
            while(k < kLen){
                var key = keys[k];
                var obj = share[key];

                if(!config[shareKey][key]){
                    config[shareKey][key] = obj;
                }
                k++;
            }
        }
        s++;
    }

    var modules = [];
    if(environment === 'development'){
        modules = fs.readdirSync('public/js/app');
        modules.forEach(function(module){

            // Set up the shim for the module
            config.shim[module] = ['BB'];

            // Loop over all the files inside the module and add them as dependencies
            var files = fs.readdirSync('public/js/app/' + module);
            files.forEach(function(file){
                file = file.replace('.js','');

                // Add to the requirejs paths
                config.paths[file] = 'app/' + module + '/' + file;

                // Add as dependency to module
                config.shim[module].push(file);
            });
        });

        // Set the environment to use it later
        config.environment = environment;
    } else {
        modules = fs.readdirSync('public/js/dist/en-US');
        modules.forEach(function(module){
            if(module.indexOf('.map') === -1){
                // Set up the shim for the module
                module = module.replace('.js','');

                //config.paths[module] = 'en-US/' + module;

                var name = module.replace('.min','');
                config.shim[name] = ['BB','BBA','router'];

                config.paths[name] = 'en-US/' + module;
            }
        });
    }

    return config;
}

/**
 * @module RequireJS Config
 * @memberOf Backbone
 * @param [environment] string
 * @returns {*} Current requirejs options based off the current environment
 */
module.exports = function(environment){
    environment = environment || require('./config').env;
    var config = configs[environment] || configs[Object.keys(configs)[0]];

    module.exports = getFiles(config,environment);

    if(environment === 'development'){
        module.exports.getFiles = getFiles;
    }

    return module.exports;
};