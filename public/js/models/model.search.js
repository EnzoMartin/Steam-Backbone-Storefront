(function (window){
    requirejs([
        'underscore',
        'backbone',
        'BB'
    ], function(_, Backbone, BB) {
        BB.model_definitions.search = Backbone.Model.extend({
            defaults: {},

            initialize: function(){
                var model = this;
                if(BB.bootstrapped.filters){
                    this.set(BB.bootstrapped.filters);
                } else {
                    $.ajax({
                        url: '/api/filters',
                        dataType: 'json',
                        contentType : 'application/json',
                        success: function(data){
                            model.set(data);
                        }
                    });
                }
            }
        });

        BB.model_definitions.results = Backbone.Model.extend({
            defaults: {},

            initialize: function(){
                this.collection = BB.get({collection:'games'});
                var model = this;

                if(BB.bootstrapped.results){
                    BB.bootstrapped.results.forEach(function(item){
                        model.collection.add(new BB.model_definitions.game(item));
                    });
                    this.set({results:BB.bootstrapped.results});
                }
            },

            url: '/api/search'
        });
    });
})(window);