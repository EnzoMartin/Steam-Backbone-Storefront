/**
 * @name Games Collection
 * @module Games
 * @memberOf Collection
 */
(function (){
    requirejs([
        'BB',
        'BBA',
        'backbone'
    ], function(BB,BBA,Backbone) {
        return BB.collection_definitions.games = Backbone.Collection.extend({
            model: function (attributes,options) {
                return new BB.model_definitions.game(attributes,options);
            },
            
            url: '/games',
            
            initialize: function(){
                var _this = this;
                this.loading = true;
                this.fetched = false;
    
                if(BB.bootstrapped.games){
                    BB.bootstrapped.games.forEach(function(game){
                        _this.add(BB.model_definitions.game.prototype.parse(game));
                    });
                    this.loading = false;
                    this.fetched = true;
                } else if(BB.bootstrapped.game){
                    this.add(BB.model_definitions.game.prototype.parse(BB.bootstrapped.game[0]));
                } else {
                    this.update();
                }
    
                BBA.socket.onBind('games',this.fetch, this);
            },
    
            update: function(){
                var _this = this;
                this.fetch({
                    success: function(){
                        _this.loading = false;
                        _this.fetched = true;
                        delete _this.error;
                    },
                    error: function(collection,error){
                        _this.loading = false;
                        _this.error = error.statusText;
                    }
                });
            }
        });
    });
})();