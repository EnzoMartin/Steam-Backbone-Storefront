/**
 * @name Game Model
 * @module Games
 * @memberOf Model
 */
(function (){
    requirejs([
        'BB',
        'backbone'
    ], function(BB,Backbone) {
        return BB.model_definitions.game = Backbone.Model.extend({
            idAttribute: 'steam_appid',

            parse: function(json){
                return json[this.id].data;
            }
        });
    });
})();