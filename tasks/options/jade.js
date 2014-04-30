module.exports = {
    dist: {
        options: {
            processContent: function(content){
                return content.replace(/(t\()(')(.+?)(')(\))/g,'"{%=$3%}"');
            }
        },
        files: {
            // Override from the task
        }
    }
};