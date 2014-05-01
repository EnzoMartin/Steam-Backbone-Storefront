/**
 * @name Homepage Games Model
 * @module Games
 * @memberOf Model
 */
(function (){
    requirejs([
        'BB',
        'backbone'
    ], function(BB,Backbone) {
        return BB.model_definitions.home = Backbone.Model.extend({
            defaults: {

            },

            url: '/api/featured',

            parse: function(data){
                var categories = {};

                for(var category in data){
                    var items = data[category];

                    if(typeof items === 'object'){
                        categories[category] = [];
                        var models = [];
                        var i = 0;
                        var len = items.length;

                        while(i < len){
                            var item = items[i];
                            categories[category].push(item.id);
                            models.push(new BB.model_definitions.game(item));
                            i++;
                        }
                        this.collection.add(models);
                    }
                }

                return data;
            }
        });
    });
})();