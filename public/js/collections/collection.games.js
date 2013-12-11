(function (window){
    requirejs([
        'underscore',
        'backbone',
        'BB'
    ], function(_, Backbone, BB) {
        BB.collection_definitions.games = Backbone.Collection.extend({
            model: BB.model_definitions.game,

            parse: function(data){
                console.log('adding',data);
                return data;
            }
        });
    });
})(window);