(function (window){
    requirejs([
        'underscore',
        'backbone',
        'BB'
    ], function(_, Backbone, BB) {
        BB.collection_definitions.games = Backbone.Collection.extend({
            initialize: function(){
                if(BB.bootstrapped.games){
                    if(Object.keys(BB.bootstrapped.games).length){
                        var collection = this;

                        for(var id in BB.bootstrapped.games){
                            collection.add(new BB.model_definitions.game(BB.bootstrapped.games[id].data));
                        }
                        BB.bootstrapped.games = false;
                    }
                }
            },

            model: BB.model_definitions.game
        });
    });
})(window);