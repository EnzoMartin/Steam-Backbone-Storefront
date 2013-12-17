(function (window){
    requirejs([
        'underscore',
        'backbone',
        'BB'
    ], function(_, Backbone, BB) {
        BB.collection_definitions.games = Backbone.Collection.extend({
            model: BB.model_definitions.game,

            initialize: function(){
                console.log(BB.bootstrapped.results)
            }
        });
    });
})(window);