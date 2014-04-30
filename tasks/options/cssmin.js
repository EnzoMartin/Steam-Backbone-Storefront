module.exports = {
    minify: {
        expand: true,
        cwd: 'public/css/',
        src: ['contents.css','highlight.css'],
        dest: 'public/css/',
        ext: '.min.css'
    }
};