(function (window){
    requirejs([
        'underscore',
        'backbone',
        'BB'
    ], function(_, Backbone, BB) {
        _.extend(BB.model_definitions,{
            featured: Backbone.Model.extend({
                defaults: {

                }
            })
        });
    });
})(window);