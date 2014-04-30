module.exports = {
    dist: {
        files: {
            'public/css/structure.min.css': 'scss/structure.scss'
        },
        options: {
            style: 'compressed'
        }
    },
    dev: {
        files: {
            'public/css/structure.css': 'scss/structure.scss'
        },
        options: {
            style: 'expanded',
            sourceComments: 'normal'
        }
    }
};