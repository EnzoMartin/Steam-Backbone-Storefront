(function (window){
    requirejs([
        'underscore',
        'backbone',
        'BB'
    ], function(_, Backbone, BB) {
        BB.model_definitions.search = Backbone.Model.extend({
            defaults: {

            },

            url: '/api/search'
        });
    });
})(window);