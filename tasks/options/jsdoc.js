module.exports = {
    src: [
        'app/controller/*.js',
        'app/modules/*.js',
        'public/js/app/*/*.js',
        'public/js/app/*/*/*.js',
        'public/js/*.js',
        'config/*.*',
        //'Gruntfile.js',
        //'tasks/*.js',
        'app.js'
    ],
    options: {
        destination: '.grunt/.docs'
    }
};
