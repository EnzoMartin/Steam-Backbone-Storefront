module.exports = {
    dist: {
        src: ['.grunt/.templates/**/*.html'],
        options: {
            locales: '.grunt/.locales/*.json',
            output: '.grunt/.localized',
            base:'.grunt/.templates/',
            delimiters: 'custom'
        }
    }
};