(function (window){
    requirejs([
        'underscore',
        'backbone',
        'BB'
    ], function(_, Backbone, BB) {
        BB.model_definitions.game = Backbone.Model.extend({
            idAttribute: "id"
        });
    });
})(window);