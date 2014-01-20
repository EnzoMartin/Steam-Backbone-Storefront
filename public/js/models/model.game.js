(function (){
    requirejs([
        'BB',
        'backbone'
    ], function(BB,Backbone) {
        BB.model_definitions.game = Backbone.Model.extend({
            idAttribute: 'steam_appid',

            url: function(){
                return '/game/' + this.id;
            },

            parse: function(json){
                return json[this.id].data;
            }
        });
    });
})();