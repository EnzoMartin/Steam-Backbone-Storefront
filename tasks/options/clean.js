module.exports = {
    modules: [
        '.grunt/.build/*',
        '.grunt/.dist/*',
        '.grunt/.locales/*',
        '.grunt/.localized/*',
        '.grunt/.modules/*',
        '.grunt/.require/*',
        '.grunt/.templates/*'
    ],
    bamboo: [
        '.grunt/.bower',
        'bower_components',
        'node_modules/bower'
    ],
    final: [
        '.grunt',
        'bower_components',
        'bower',
        '.sass_cache',
        'public/css/bootstrap.css',
        'public/css/font-awesome.css',
        'public/css/structure.css',
        'public/css/ui-lightness/jquery-ui.css',
        'public/css/ui-lightness/jquery.ui.theme.css',
        'locales',
        'scss',
        'app/views/templates',
        'public/js/app',
        'public/js/libraries/bower',
        'public/js/lib.js',
        'public/js/main.js',
        'public/js/router.js',
        'node_modules/bower',
        'bower.json',
        'config.rb',
        'README.md'
    ],
    doc: ['.grunt/.docs/*'],
    dist: ['public/js/dist/*'],
    tests: [
        'tasks',
        'node_modules/grun*',
        'node_modules/load-grunt-tasks',
        'Gruntfile.js',
        'node_modules/mocha-bamboo-reporter',
        'node_modules/supertest',
        'node_modules/mocha',
        'node_modules/cha*',
        'tests',
        'test.js'
    ],
    bower: ['public/js/libraries/bower/*','scss/bootstrap/*','.grunt/.bower','bower_components']
};