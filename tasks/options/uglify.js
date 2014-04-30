module.exports = {
    modules: {
        options: {
            compress: {
                drop_console: true
            },
            beautify: true,
            mangle: false,
            sourceMap: false
        },
        files: [
            {
                expand: true,
                cwd: '.grunt/.modules',
                src: '**/*.js',
                dest: '.grunt/.require'
            }
        ]
    },
    dist: {
        options: {
            beautify: false,
            mangle: true,
            sourceMap: true
        },
        files: [
            {
                expand: true,
                cwd: '.grunt/.modules',
                src: '**/*.js',
                dest: 'public/js/dist/',
                rename: function (dest, src) {
                    return dest + src.replace('.js','.min.js');
                }
            },
            {
                expand: true,
                cwd: 'public/js/libraries/bower',
                src: '*.js',
                dest: 'public/js/dist/libraries/bower/',
                rename: function (dest, src) {
                    return dest + src.replace('.js','.min.js');
                }
            }
        ]
    }
};