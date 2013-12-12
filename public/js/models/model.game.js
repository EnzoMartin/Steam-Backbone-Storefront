(function (window){
    requirejs([
        'underscore',
        'backbone',
        'BB'
    ], function(_, Backbone, BB) {
        BB.model_definitions.game = Backbone.Model.extend({
            idAttribute: 'id',

            url: function(){
                return '/api/games?appids=' + this.id;
            },

            parse: function(json){
                return json[this.id].data;
            }
        });
    });
})(window);