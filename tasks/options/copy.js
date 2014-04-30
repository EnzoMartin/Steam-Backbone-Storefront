module.exports = {
    app: {
        files: [
            {expand: true, cwd: 'public/js', src: '*.js', dest: '.grunt/.modules'}
        ]
    },
    locales: {
        expand: true,
        src: ['locales/**/server.json'],
        dest: '.grunt/.locales/',
        rename: function (dest, src) {
            return dest + src.split('/')[1] + '.json';
        }
    },
    templates: {
        files: [
            // Override from the task
        ]
    }
};