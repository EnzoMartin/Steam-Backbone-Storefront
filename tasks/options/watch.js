module.exports = {
    templates: {
        files: ['app/views/templates/**'],
        tasks: ['buildTemplates'],
        options: {
            nospawn: true
        }
    },
    scss: {
        files: ['scss/**'],
        tasks: ['sass:dev'],
        options: {
            nospawn: true
        }
    },
    server: {
        files: [
            'app/controller/*',
            'app/modules/*',
            'locales/**/*',
            'config/*',
            'app.js'
        ],
        tasks: ['server'],
        options: {
            nospawn: true
        }
    }
};