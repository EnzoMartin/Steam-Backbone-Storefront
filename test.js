var chai = require('chai');
var Mocha = require('mocha');
var recursion = require('./app/modules/recursion');
var supertest = require('supertest');

// Set the environment to be 'test'
process.env.NODE_ENV = 'test';

// Start our application
app = require('./app');

// Grab config for test
var config = require('./config/config');

// Global variables
should = chai.should();

// Configure Mocha
mocha = new Mocha({
    reporter: config.reporter,
    bail: false,
    debug: false
});

console.log('Using reporter: ',config.reporter);

var url = config.url + ':' + config.port;
console.log('Connecting to: ' + url);
api = supertest(url);

// Load our test definitions
recursion.serial('tests',function(err,files){
    if(!err){
        console.log('Found %s file(s)',files.length);
        files.forEach(function(file){
            console.log('Adding test file: ',file);
            mocha.addFile('./' + file);
        });

        // Run Mocha tests
        console.log('Starting tests');
        mocha.run(function(failures){
            console.log('Testing done!');
            if(failures){
                console.error(failures);
            }
            process.exit(failures);
        });
    } else {
        throw new Error(err);
    }
});