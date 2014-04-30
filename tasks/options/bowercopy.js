module.exports = {
    options: {
        runBower: false,
        clean: false,
        srcPrefix: '.grunt/.bower'
    },
    fontAwesome: {
        options: {
            destPrefix: 'public/fonts'
        },
        files: {
            '': 'font-awesome/fonts/*'
        }
    },
    fontBootstrap: {
        options: {
            destPrefix: 'public/fonts'
        },
        files: {
            '': 'bootstrap/glyphicons-*.*'
        }
    },
    css: {
        options: {
            destPrefix: 'public/css'
        },
        files : {
            'bootstrap.css': 'bootstrap/bootstrap.css',
            'bootstrap.css.map': 'bootstrap/bootstrap.css.map',
            'font-awesome.css': 'font-awesome/font-awesome.css',
            'ui-lightness': 'jqueryui/themes/ui-lightness'
        }
    },
    sass: {
        options: {
            destPrefix: 'scss/bootstrap'
        },
        files: {
            '' : 'bootstrap-sass-official/bootstrap/*.scss',
            'mixins' : 'bootstrap-sass-official/bootstrap/mixins/*.scss'
        }
    },
    javascript: {
        options: {
            destPrefix: 'public/js/libraries/bower'
        },
        files : {
            'backbone.js': 'backbone/backbone.js',
            'backbone-helper.js': 'backbone-helper/backbone-helper.js',
            'bootstrap.js': 'bootstrap/bootstrap.js',
            'dust-full.js': 'dustjs-linkedin/dust-full.js',
            'dust-helpers.js': 'dustjs-linkedin-helpers/dust-helpers.js',
            'jquery.js': 'jquery/jquery.js',
            'jqueryui.js': 'jqueryui/jquery-ui.js',
            'moment-timezone.js': 'moment-timezone/moment-timezone.js',
            'moment.js': 'momentjs/moment.js',
            'require.js': 'requirejs/require.js',
            'require-text.js': 'requirejs-text/text.js',
            'underscore.js': 'underscore/underscore.js',
            'socket.io.js': 'socket.io-client/dist/socket.io.js'
        }
    }
};