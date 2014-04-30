module.exports = {
    dist: {
        options: {
            runtime: false,
            wrapper: false,
            wrapperOptions: {
                templatesNamesGenerator: function(self,path){
                    var paths = path.split('/');
                    var name = paths[paths.length -1];
                    return name.replace('.html','');
                }
            }
        },
        files: [
            // Override from the task
        ]
    }
};